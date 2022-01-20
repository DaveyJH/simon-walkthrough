/**
* @jest-environment jsdom
*/

const { 
  game,
  newGame,
  addTurn,
  lightsOn,
  showTurns,
  playerTurn
} = require("../simon");

jest.spyOn(window, "alert").mockImplementation(() => {});

beforeAll(() => {
  const fs = require("fs");
  const fileContents = fs.readFileSync("index.html", "utf-8");
  document.open();
  document.write(fileContents);
  document.close();
});

describe("game object contains keys", () => {
  test("score key exists", () => {
    expect("score" in game).toBe(true);
  });
  test("currentGame key exists", () => {
    expect("currentGame" in game).toBe(true);
  });
  test("playerMoves key exists", () => {
    expect("playerMoves" in game).toBe(true);
  });
  test("choices key exists", () => {
    expect("choices" in game).toBe(true);
  });
  test("choices contain correct ids", () => {
    expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
  });
  test("turnNumber key exists", () => {
    expect("turnNumber" in game).toBe(true);
  });
  test("turnInProgress key exists", () => {
    expect("turnInProgress" in game).toBe(true);
  });
  test("lastButton key exists", () => {
    expect("lastButton" in game).toBe(true);
  });
  test("turnInProgress key has correct default value", () => {
    expect(game.turnInProgress).toBe(false);
  });
  test("lastButton key has correct default value", () => {
    expect(game.lastButton).toBe("");
  });
});

describe("newGame works correctly", () => {
  beforeAll(() => {
    game.playerMoves.push("button1");
    game.currentGame.push("button1");
    game.score = 42;
    document.getElementById("score").innerText = "42";
    newGame();
  });
  test("should set game score to zero", () => {
    expect(game.score).toEqual(0);
  });
  test("should reset playerMoves", () => {
    expect(game.playerMoves.length).toEqual(0);
  });
  test("currentGame should contain one move", () => {
    expect(game.currentGame.length).toEqual(1);
  });
  test("should display 0 for the element with the id of 0", () => {
    expect(document.getElementById("score").innerText).toEqual(0);
  });
  test("data-listener should be true", () => {
    const circles = document.getElementsByClassName("circle");
    for (let circle of circles) {
      expect(circle.dataset.listener).toEqual("true");
    }
  });
});

describe("gameplay works correctly", () => {
  beforeEach(() => {
    game.score = 0;
    game.currentGame = [];
    game.playerMoves = [];
    addTurn();
  });
  afterEach(() => {
    game.score = 0;
    game.currentGame = [];
    game.playerMoves = [];
  });
  test("addTurn adds a new turn to the game", () => {
    addTurn();
    expect(game.currentGame.length).toBe(2);
  });
  test("should add correct clas to light up buttons", () => {
    let button = document.getElementById(game.currentGame[0]);
    lightsOn(game.currentGame[0]);
    expect(button.classList).toContain("light");
  });
  test("showTurns should update game.turnNumber", () => {
    game.turnNumber = 42;
    showTurns();
    expect(game.turnNumber).toBe(0);
  });
  test("checks correct player turn is correct", () => {
    setTimeout(() => {
      document.getElementById(game.currentGame[0]).click();
      expect(game.playerMoves[0]).toEqual(game.currentGame[0]);
    }, 1000);
  });
  test("checks incorrect player turn is incorrect", () => {
    game.playerMoves.push("wrong");
    expect(game.playerMoves[0]).not.toEqual(game.currentGame[0]);
  });
  test("should increment score if turn is correct", () => {
    game.playerMoves.push(game.currentGame[0]);
    playerTurn();
    expect(game.score).toBe(1);
  });
  test("should alert if move is wrong", () => {
    game.playerMoves.push("wrong");
    playerTurn();
    expect(window.alert).toBeCalledWith("Wrong move!");
  });
  test("game.turnInProgress should be true while computer is showing turns",
    () =>  {
      showTurns();
      expect(game.turnInProgress).toBe(true);
  });
  test("game.turnInProgress should return to false after computer turns",
    () =>  {
      showTurns();
      setTimeout(() => {
        expect(game.turnInProgress).toBe(false);
      }, 1000);
  });
  test("clicking during the computer sequence should fail", () => {
    showTurns();
    game.lastButton = "";
    document.getElementById("button2").click();
    expect(game.lastButton).toEqual("");
  });
});

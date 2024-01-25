// 7cols 6rows
// input is the column
// applies the rules of gravity

type Blank = "🟤";
type FirstPlayer = "⚪";
type SecondPlayer = "⚫";

type PlayerUnion = FirstPlayer | SecondPlayer;
type PlacementUnion = PlayerUnion | Blank;
type RowType = [
  PlacementUnion,
  PlacementUnion,
  PlacementUnion,
  PlacementUnion,
  PlacementUnion,
  PlacementUnion,
  PlacementUnion,
];
type RowUnion = 1 | 2 | 3 | 4 | 5 | 6;
type AddToRow<Row extends RowUnion> = [never, 2, 3, 4, 5, 6, never][Row];
type ColumnUnion = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type AddToColumn<Column extends ColumnUnion> = [
  1,
  2,
  3,
  4,
  5,
  6,
  never,
][Column];
type SubtractFromColumn<Column extends ColumnUnion> = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
][Column];
type TurnUnion = `${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
type TurnToColumn<Turn extends TurnUnion> = {
  "1": 0;
  "2": 1;
  "3": 2;
  "4": 3;
  "5": 4;
  "6": 5;
  "7": 6;
}[Turn];

// 7x6
// Board Logic
type BoardType = {
  1: RowType;
  2: RowType;
  3: RowType;
  4: RowType;
  5: RowType;
  6: RowType;
  text?: string;
};

type InitialBoard = {
  1: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  2: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  3: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  4: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  5: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  6: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
};

type BoardWithText<Board extends BoardType, Text extends string> = {
  [prop in keyof Board | "text"]: prop extends "text" ? Text : Board[prop];
};

type NewRowArray<
  Row extends RowType,
  Player extends PlayerUnion,
  Column extends ColumnUnion,
  NewRow extends PlacementUnion[] = [],
> = NewRow["length"] extends 7 //Will cause problem
  ? NewRow
  : NewRow["length"] extends Column
    ? NewRowArray<Row, Player, Column, [...NewRow, Player]>
    : NewRowArray<Row, Player, Column, [...NewRow, Row[NewRow["length"]]]>;

type CheckNewRowArray = NewRowArray<InitialBoard[1], FirstPlayer, 3>;

type NewBoard<
  Board extends BoardType,
  Player extends PlayerUnion,
  Column extends ColumnUnion,
  Row extends RowUnion = 1,
> = [AddToRow<Row>, Board[AddToRow<Row>][Column]] extends
  | [never, PlacementUnion]
  | [number, PlayerUnion]
  ? // For creating the new Board
    {
      [prop in RowUnion]: prop extends Row
        ? NewRowArray<Board[prop], Player, Column>
        : prop extends "text"
          ? ""
          : Board[prop];
    }
  : NewBoard<Board, Player, Column, AddToRow<Row>>;

type CheckNewBoard = NewBoard<InitialBoard, FirstPlayer, 3>;
type CheckNewBoard2 = NewBoard<CheckNewBoard, SecondPlayer, 3>;

// Tie Logic
type Tie<
  Board extends BoardType,
  Row extends RowUnion = 1,
  Column extends ColumnUnion = 0,
> = [Row] extends [never]
  ? [Column] extends [never]
    ? true
    : Tie<BoardType, AddToRow<Row>, 0>
  : Board[Row][Column] extends Blank
    ? false
    : Tie<Board, Row, AddToColumn<Column>>;

type CheckTie1 = Tie<InitialBoard>;

// Winning Logic
type WinningByRow<
  Board extends BoardType,
  Player extends PlayerUnion,
  Row extends RowUnion,
  Column extends ColumnUnion,
  Count extends unknown[] = [],
> = Count["length"] extends 4
  ? true
  : [Row] extends [never]
    ? false
    : [Column] extends [never]
      ? false
      : Board[Row][Column] extends Player
        ? WinningByRow<Board, Player, Row, AddToColumn<Column>, [...Count, 0]>
        : false;

type CheckWinningByRow = WinningByRow<
  {
    1: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    2: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    3: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    4: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    5: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    6: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
  },
  FirstPlayer,
  6,
  0
>;

type WinningByColumn<
  Board extends BoardType,
  Player extends PlayerUnion,
  Row extends RowUnion,
  Column extends ColumnUnion,
  Count extends unknown[] = [],
> = Count["length"] extends 4
  ? true
  : [Row] extends [never]
    ? false
    : [Column] extends [never]
      ? false
      : Board[Row][Column] extends Player
        ? WinningByColumn<Board, Player, AddToRow<Row>, Column, [...Count, 0]>
        : false;

type CheckWinningByColumn = WinningByColumn<
  {
    1: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    2: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    3: [FirstPlayer, "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    4: [FirstPlayer, "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    5: [FirstPlayer, "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    6: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
  },
  FirstPlayer,
  3,
  0
>;

type WinningByRightDiagonal<
  Board extends BoardType,
  Player extends PlayerUnion,
  Row extends RowUnion,
  Column extends ColumnUnion,
  Count extends unknown[] = [],
> = Count["length"] extends 4
  ? true
  : [Row] extends [never]
    ? false
    : [Column] extends [never]
      ? false
      : Board[Row][Column] extends Player
        ? WinningByRightDiagonal<
            Board,
            Player,
            AddToRow<Row>,
            AddToColumn<Column>,
            [...Count, 0]
          >
        : false;

type CheckWinningByRightDiagonal = WinningByRightDiagonal<
  {
    1: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    2: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    3: [FirstPlayer, "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    4: [FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤", "🟤", "🟤"];
    5: [FirstPlayer, "🟤", FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
    6: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
  },
  FirstPlayer,
  3,
  0
>;

type WinningByLeftDiagonal<
  Board extends BoardType,
  Player extends PlayerUnion,
  Row extends RowUnion,
  Column extends ColumnUnion,
  Count extends unknown[] = [],
> = Count["length"] extends 4
  ? true
  : [Row] extends [never]
    ? false
    : [Column] extends [never]
      ? false
      : Board[Row][Column] extends Player
        ? WinningByLeftDiagonal<
            Board,
            Player,
            AddToRow<Row>,
            SubtractFromColumn<Column>,
            [...Count, 0]
          >
        : false;

type CheckWinningByLeftDiagonal = WinningByLeftDiagonal<
  {
    1: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    2: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
    3: [FirstPlayer, "🟤", "🟤", FirstPlayer, "🟤", "🟤", "🟤"];
    4: [FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤", "🟤"];
    5: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
    6: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
  },
  FirstPlayer,
  3,
  3
>;

type Winner<
  Board extends BoardType,
  Row extends RowUnion = 3,
  Column extends ColumnUnion = 0,
> = [Row] extends [never]
  ? false
  : [Column] extends [never]
    ? Winner<Board, AddToRow<Row>, 0>
    : Board[Row][Column] extends PlayerUnion
      ? WinningByRow<Board, Board[Row][Column], Row, Column> extends true
        ? Board[Row][Column]
        : WinningByColumn<Board, Board[Row][Column], Row, Column> extends true
          ? Board[Row][Column]
          : WinningByRightDiagonal<
                Board,
                Board[Row][Column],
                Row,
                Column
              > extends true
            ? Board[Row][Column]
            : WinningByLeftDiagonal<
                  Board,
                  Board[Row][Column],
                  Row,
                  Column
                > extends true
              ? Board[Row][Column]
              : Winner<Board, Row, AddToColumn<Column>>
      : Winner<Board, Row, AddToColumn<Column>>;

type CheckWinner = Winner<{
  1: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  2: ["🟤", "🟤", "🟤", "🟤", "🟤", "🟤", "🟤"];
  3: [FirstPlayer, "🟤", "🟤", FirstPlayer, "🟤", "🟤", "🟤"];
  4: [FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤", "🟤"];
  5: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
  6: [FirstPlayer, FirstPlayer, FirstPlayer, FirstPlayer, "🟤", "🟤", "🟤"];
}>;

type Connect4<
  Turns extends string,
  Board extends BoardType = InitialBoard,
  Player extends PlayerUnion = FirstPlayer,
> = Winner<Board> extends PlayerUnion
  ? BoardWithText<Board, `The winner is ${Winner<Board>}`>
  : Tie<Board> extends true
    ? BoardWithText<Board, `Tie! No winners!`>
    : Turns extends `${infer Turn}${infer RestOfTurns}`
      ? Turn extends TurnUnion
        ? Board[1][TurnToColumn<Turn>] extends Blank
          ? Connect4<
              RestOfTurns,
              NewBoard<Board, Player, TurnToColumn<Turn>>,
              Player extends FirstPlayer ? SecondPlayer : FirstPlayer
            >
          : BoardWithText<Board, `The column is already full! -> ${Turn}`>
        : BoardWithText<Board, `Invalid character only 1-7 -> ${Turn}`>
      : Board;

type Result = Connect4<"1234343434">;

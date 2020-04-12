import React, { useEffect, HTMLProps } from "react";
import "./Board.css";
import "drawingboard.js/dist/drawingboard.css";
import "drawingboard.js";

declare global {
  class Board {
    blankCanvas: string;
    getImg(): string;
    ev: {
      bind(event: string, callback: () => void): void;
    };
  }
  interface Window {
    DrawingBoard: {
      Board: new (id: string, settings: object) => Board;
    };
  }
}

interface Props extends HTMLProps<HTMLDivElement> {
  onDrawingChange(dataURL: string): void;
}

export const Board = ({ id = "draw", onDrawingChange: onChange }: Props) => {
  useEffect(() => {
    const board = new window.DrawingBoard.Board(id, {
      webStorage: false,
      size: 20,
    });

    const emit = () => {
      onChange(board.getImg());
    };

    onChange(board.blankCanvas);

    board.ev.bind("board:stopDrawing", emit);
    board.ev.bind("board:reset", emit);
    board.ev.bind("board:mouseOut", emit);
  }, [id, onChange]);

  return <div id={id} />;
};

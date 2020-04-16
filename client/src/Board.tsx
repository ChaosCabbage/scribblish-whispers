import React, { useEffect, HTMLProps, useRef } from "react";
import "./Board.css";
import "drawingboard.js/dist/drawingboard.css";
import "drawingboard.js";

declare global {
  class Board {
    blankCanvas: string;
    getImg(): string;
    ev: {
      bind(event: string, callback: () => void): void;
      unbind(event: string, callback: () => void): void;
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
  const boardRef = useRef<Board | null>(null);
  useEffect(() => {
    boardRef.current = new window.DrawingBoard.Board(id, {
      webStorage: false,
      size: 5,
    });
  }, [id]);

  useEffect(() => {
    if (boardRef.current === null) return;
    const board = boardRef.current;

    const emit = () => {
      onChange(board.getImg());
    };

    onChange(board.blankCanvas);
    const events = ["board:stopDrawing", "board:reset", "board:mouseOut", "historyNavigation"];
    events.forEach((event) => {
      board.ev.bind(event, emit);
    });

    return () => {
      events.forEach((event) => {
        board.ev.unbind(event, emit);
      });
    };
  }, [onChange]);

  return <div id={id} />;
};

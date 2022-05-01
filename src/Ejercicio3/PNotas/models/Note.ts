export enum Color {
    red = "red",
    yellow = "yellow",
    green = "green",
    blue = "blue",
    white = "white",
  };
  
  
  /**
   * Implements a user note.
   * @var title Title of the note.
   * @var color Color of the note.
   * @var body Body of the note_
   */
  export class Note {
    public title: string;
    public color: Color;
    public body: string;
  
    constructor(newTitle: string, newColor: Color, newBody: string) {
      this.title = newTitle;
      this.color = newColor;
      this.body = newBody;
    }
  }
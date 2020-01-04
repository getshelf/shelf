import React, { useState } from 'react';
import cn from 'classnames';
import { INote, Note } from 'src/models/Note';
import { observer } from 'mobx-react';
import styles from './NoteItem.css';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ChevronDown, Plus } from 'react-feather';

interface INoteItemProps {
  note: INote;
  onSelect: (note: INote) => void;
  onOpen: (note: INote) => void;
  onAdd: (note: INote) => void;
  isSelected: (id: string) => boolean;
}

const toggleIconProps = {
  size: 14,
  color: '#4C566A'
};

export const NoteItem = observer((props: INoteItemProps) => {
  const { note, onOpen, onSelect, onAdd, isSelected } = props;
  const [isOpen, setOpen] = useState(false);
  const selected = isSelected(note.id);

  const handleToggleClick = async (
    ev: React.SyntheticEvent<HTMLSpanElement, Event>
  ) => {
    ev.stopPropagation();
    await onOpen(note);
    setOpen(!isOpen);
  };

  const handleAddClick = (ev: React.SyntheticEvent<HTMLSpanElement, Event>) => {
    ev.stopPropagation();
    onAdd(note);
  };

  return (
    <li className={styles.root}>
      <div className={cn(styles.item, {[styles.selected]: selected})}>
        <span className={styles.toggle} onClick={handleToggleClick}>
          {isOpen ? <ChevronDown {...toggleIconProps}/> : <ChevronRight {...toggleIconProps}/>}
        </span>
        <NavLink to={`/note/${note.id}`} className={styles.title}>
          <span>{note.title}</span>
        </NavLink>
        <span className={styles.add} onClick={handleAddClick}>
          <Plus size={10} />
        </span>
      </div>
      {isOpen ? (
        <ul className={styles.list}>
          {note.notes.map((note: Note) => (
            <NoteItem
              key={note.id}
              note={note}
              onOpen={onOpen}
              onSelect={onSelect}
              onAdd={onAdd}
              isSelected={isSelected}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
});

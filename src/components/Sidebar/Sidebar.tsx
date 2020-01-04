import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { RootStoreContext } from 'src/stores/RootStore';
import { NoteItem } from '@components/NoteItem/NoteItem';
import styles from './Sidebar.css';
import { Note } from '@models/Note';

interface INotePageParams {
  noteId: string;
}

export const Sidebar = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const match = useRouteMatch<INotePageParams>('/note/:noteId');

  const handleOpen = async (note: Note) => {
    await rootStore.notesStore.fetchNotes(note.id);
  };

  const handleSelect = (note) => {
    // rootStore.notes.selectNote(note.id);
  };

  const handleAdd = async (note?: Note) => {
    const parentId = note ? note.id : false;
    rootStore.notesStore.createNote(parentId);
  };

  const isSelected = (id: string) => {
    if (match) {
      return match.params.noteId === id
    }
    return false;
  };

  return (
    <div className={styles.root}>
        <h2 className={styles.title}>
          Shelf
          <span className={styles.version}>alpha</span>
        </h2>
        {rootStore.notesStore.root.map(n => (
          <NoteItem
            key={n.id}
            note={n}
            onOpen={handleOpen}
            onSelect={handleSelect}
            onAdd={handleAdd}
            isSelected={isSelected}
          />
        ))}
        <button onClick={() => handleAdd()}>Add note</button>
    </div>
  );
});

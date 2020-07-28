import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import { Div } from '../components/Div';
import { Character } from '../logic/character';
import { CharacterSheetHeader } from '../components/CharacterSheetHeader';
import { Link } from 'react-router-dom';
import { exampleCharacter } from '../exampleData';
import { NewCharacterDialog } from '../components/NewCharacterDialog';

export const CharactersPage: FC = () => {
  const classes = useStyles();
  const { push } = useHistory();

  const [characters] = useState<Character[]>(
    JSON.parse(
      localStorage.getItem('characters') ?? JSON.stringify([exampleCharacter]),
    ),
  );

  useEffect(() => {
    localStorage.setItem('characters', JSON.stringify(characters));
  }, [characters]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const addCharacter = (character: Character) => {
    localStorage.setItem(
      'characters',
      JSON.stringify([...characters, character]),
    );
    push(`/characters/${character.id}`);
  };

  return (
    <Div justify="flex-end" align="center" grows>
      <Div className={classes.content} spacing>
        {characters.map((character) => {
          return (
            <Link to={`/characters/${character.id}`} className={classes.link}>
              <CharacterSheetHeader character={character} />
            </Link>
          );
        })}
        <Button
          color="primary"
          fullWidth
          onClick={() => setAddDialogOpen(true)}
        >
          Add Character
        </Button>
      </Div>
      <NewCharacterDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAccept={addCharacter}
      />
    </Div>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    maxWidth: 400,
    width: '100%',
    padding: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
}));

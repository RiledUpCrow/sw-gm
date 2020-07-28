import React, { FC, useState } from 'react';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { Character } from '../logic/character';
import { Div } from './Div';
import { cn } from '../logic/cn';
import { CharacterSheetHeader } from './CharacterSheetHeader';
import { CharacterTraits } from './CharacterTraits';
import { FastIconButton } from './FastIconButton';

export interface CharacterSheetProps {
  character: Character;
  onChange?: (character: Character) => void;
  className?: string;
}

export const CharacterSheet: FC<CharacterSheetProps> = ({
  character: initialCharacter,
  onChange,
  className,
}) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [character, setCharacter] = useState(initialCharacter);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    onChange?.(character);
  };

  return (
    <Div className={cn(classes.root, className)} spacing>
      <CharacterSheetHeader character={character} className={classes.header} />
      <Div row align="center" spacing>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={(_, newTab) => setTab(newTab)}
          className={classes.tabs}
        >
          <Tab className={classes.tab} label="Traits" />
          <Tab className={classes.tab} label="Info" />
          <Tab className={classes.tab} label="Items" />
          <Tab className={classes.tab} label="Powers" />
        </Tabs>
        <FastIconButton
          color="secondary"
          className={classes.fab}
          size="small"
          onClick={() => {
            if (editing) {
              handleSave();
            }
            setEditing(!editing);
          }}
        >
          {!editing ? <EditIcon /> : <SaveIcon />}
        </FastIconButton>
      </Div>
      <Div className={classes.content}>
        {tab === 0 && (
          <CharacterTraits
            character={character}
            onChange={editing ? setCharacter : undefined}
          />
        )}
      </Div>
    </Div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  header: {
    paddingTop: theme.spacing(2),
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.appBar,
  },
  content: {},
  tab: {
    minWidth: 'auto',
  },
  tabs: {
    flexGrow: 1,
  },
  fab: {},
}));

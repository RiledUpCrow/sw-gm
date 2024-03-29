import React, { FC, useState, useRef, Dispatch, memo } from 'react';
import { AttributeName, TraitLevel } from '../logic/character';
import { makeStyles, Button, lighten, Popover } from '@material-ui/core';
import { AttributeIcon } from './AttributeIcon';
import { DieIcon } from './DieIcon';
import { Div } from './Div';
import { RaiseBar } from './RaiseBar';
import { FastIconButton } from './FastIconButton';
import { prepareMultiThrow } from '../logic/prepareMultiThrow';
import { useDice } from '../logic/DiceContext';
import { Die } from '../model/die.model';
import { CharacterAction } from '../logic/characterReducer';

export interface AttributeViewProps {
  characterName: string;
  wildDie?: Die;
  attribute: AttributeName;
  level: TraitLevel;
  onChange?: Dispatch<CharacterAction>;
}

const AttributeView: FC<AttributeViewProps> = ({
  characterName,
  wildDie,
  attribute,
  level,
  onChange,
}) => {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  const anchorRef = useRef();
  const throwDice = useDice();

  const roll = () => {
    const options = prepareMultiThrow({
      type: 'trait',
      name: `${characterName}'s ${attribute}`,
      traitDie: level.base,
      modifier: level.bonus,
      wildDie,
    });
    throwDice(options);
  };

  return (
    <>
      <Button
        variant="contained"
        className={classes.attribute}
        classes={{ label: classes.column }}
        onClick={onChange ? () => setEditing(true) : roll}
        buttonRef={anchorRef}
        fullWidth
      >
        <AttributeIcon type={attribute} size={2} className={classes.spaced} />
        <DieIcon type={level.base} size="large" color="secondary" />
      </Button>

      {onChange && (
        <Popover
          open={editing}
          onClose={() => setEditing(false)}
          anchorEl={anchorRef.current}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          <Div row spacing className={classes.options}>
            {traitDice.map((die) => (
              <FastIconButton
                key={die}
                onClick={() => {
                  onChange({
                    type: 'setAttribute',
                    attribute,
                    level: { base: die }, // TODO implement skill bonus
                  });
                  setEditing(false);
                }}
                label={`d${die}`}
              >
                <DieIcon type={die} color="secondary" />
                {level.bonus && die === level.base && (
                  <RaiseBar className={classes.bonus} value={level.bonus} />
                )}
              </FastIconButton>
            ))}
          </Div>
        </Popover>
      )}
    </>
  );
};

const traitDice = [4, 6, 8, 10, 12] as const;

const useStyles = makeStyles((theme) => ({
  spaced: {
    marginBottom: theme.spacing(1),
  },
  attribute: {
    minWidth: 0,
    padding: `${theme.spacing(1)}px 0`,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: lighten(theme.palette.background.paper, 0.1),
    },
    color: theme.palette.getContrastText(theme.palette.background.paper),
    flexGrow: 1,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  bonus: {
    position: 'absolute',
    width: '100%',
    bottom: -8,
  },
  options: {
    padding: theme.spacing(1),
  },
}));

export default memo(AttributeView);

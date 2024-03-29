import React, { FC, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { DiceLocalHistoryManager } from '../components/DiceLocalHistoryManager';
import DiceManagerUsingRoute from '../components/DiceManagerUsingRoute';
import LoadingView from '../components/LoadingView';
import LocalCharacterManager from '../components/LocalCharacterManager';
import { useSetLinks } from '../components/NavigationManager';
import { localLinks } from '../logic/localLinks';

const DicePage = lazy(() => import('../pages/DicePage'));
const CardsPage = lazy(() => import('../pages/CardsPage'));
const DiceHistoryPage = lazy(() => import('../pages/DiceHistoryPage'));
const CharactersPage = lazy(() => import('../pages/CharactersPage'));
const CharacterPage = lazy(() => import('../pages/CharacterPage'));
const LocationsPage = lazy(() => import('./LocationsPage'));
const TableListPage = lazy(() => import('../pages/TableListPage'));

const LocalPage: FC = () => {
  useSetLinks(localLinks);

  return (
    <DiceLocalHistoryManager>
      <DiceManagerUsingRoute diceThrowerPath="/">
        <LocalCharacterManager>
          <Suspense fallback={<LoadingView />}>
            <Switch>
              <Route exact path="/" component={DicePage} />
              <Route exact path="/cards" component={CardsPage} />
              <Route exact path="/history" component={DiceHistoryPage} />
              <Route exact path="/characters" component={CharactersPage} />
              <Route
                exact
                path="/characters/:characterId"
                component={CharacterPage}
              />
              <Route exact path="/locations" component={LocationsPage} />
              <Route exact path="/tables" component={TableListPage} />
            </Switch>
          </Suspense>
        </LocalCharacterManager>
      </DiceManagerUsingRoute>
    </DiceLocalHistoryManager>
  );
};

export default LocalPage;

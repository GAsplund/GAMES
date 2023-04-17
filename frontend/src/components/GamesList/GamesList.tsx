import { useApiGet } from '@/src/hooks/apiHooks';
import { FC } from 'react';
import GameCard from '../GameCard/GameCard';
import styles from './GamesList.module.css';

interface GamesListProps {}

interface Game {
	id: string;
	name: string;
	description: string;
	platformName: string;
	playtime: string;
	releaseDate: string;
}

const GamesList: FC<GamesListProps> = () => {
	const { data, error, loading } = useApiGet<Game[]>('/games');

	return (
		<div>
			<h1 className={styles.gamesListHeader}>Games List</h1>

			{loading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error}</p> : null}

			{data ? (
				<ul className={styles.gamesList}>
					{data.map((game) => (
						<GameCard
							key={game.id}
							name={game.name}
							description={game.description}
							platform={game.platformName}
							playtime={game.playtime}
							release_date={game.releaseDate}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default GamesList;

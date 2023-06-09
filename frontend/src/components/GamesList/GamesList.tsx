import { useUser } from '@/src/hooks/api/auth';
import { useGamesList } from '@/src/hooks/api/games';
import ClockIcon from '@/src/icons/Clock';
import PersonIcon from '@/src/icons/Person';
import Link from 'next/link';
import { FC, useState } from 'react';
import GameCard from '../GameCard/GameCard';
import GameFilter from '../GameFilter/GameFilter';
import GamesSearchBar from '../Games/GamesSearchBar/GamesSearchBar';
import Legend from '../Games/Legend/Legend';
import styles from './GamesList.module.scss';

interface GamesListProps {}

const GamesList: FC<GamesListProps> = () => {
	const [search, setSearch] = useState('');
	const filter = useFilterState();
	const { data, error, isLoading } = useGamesList(search, filter.full);

	const legendItems = [
		{
			name: 'Amount of players',
			icon: PersonIcon
		},
		{
			name: 'Expected playtime',
			icon: ClockIcon
		}
	];

	return (
		<>
			<div className={styles.leftContainer}>
				<GameFilter filterState={filter} />
				<Legend items={legendItems} />
			</div>
			<div className={styles.contentLayout}>
				<div className={styles.searchRow}>
					<GamesSearchBar searchValue={search} setSearch={setSearch} />
					<AddGameButton />
				</div>

				{isLoading ? <p>Loading...</p> : null}

				{error ? <p>Error: {error.message}</p> : null}

				{data ? (
					<ul className={styles.gamesList}>
						{data.map((game) => (
							<GameCard key={game.id} game={game} />
						))}
					</ul>
				) : null}
			</div>
		</>
	);
};

const AddGameButton: FC = () => {
	const { data } = useUser();

	if (!data) return null;

	return (
		<Link className={styles.addGame} href="/add">
			Add Game
		</Link>
	);
};

export const useFilterState = () => {
	// This hook is an example of why sometimes you want to pass state up.
	const [platform, setPlatform] = useState<string>();
	const [releaseBefore, setReleaseBefore] = useState<Date>();
	const [releaseAfter, setReleaseAfter] = useState<Date>();
	const [playtimeMax, setPlaytimeMax] = useState<number>();
	const [playtimeMin, setPlaytimeMin] = useState<number>();
	const [playerCount, setPlayerCount] = useState<number>();
	const [owner, setOwner] = useState<string>();

	return {
		full: {
			platform,
			releaseBefore,
			releaseAfter,
			playtimeMax,
			playtimeMin,
			playerCount,
			owner
		},
		setPlatform,
		setReleaseBefore,
		setReleaseAfter,
		setPlaytimeMax,
		setPlaytimeMin,
		setPlayerCount,
		setOwner
	};
};

export default GamesList;

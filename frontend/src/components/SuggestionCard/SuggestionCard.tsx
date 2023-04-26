import { FC } from 'react';
import styles from './SuggestionCard.module.css';
import { useApiPost } from '@/src/hooks/apiHooks';

interface SuggestionCardProps {
	name: string;
	description: string;
	platform: string;
	playtimeMinutes: string;
	releaseDate: string;
	playerMin: string;
	playerMax: string;
}

const SuggestionCard: FC<SuggestionCardProps> = ({
	name,
	description,
	platform,
	releaseDate,
	playtimeMinutes,
	playerMin,
	playerMax
}) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
			<p>Platform: {platform}</p>
			<p>Playtime: {playtimeMinutes} mins</p>
			<p>Release date: {releaseDate}</p>
			<p>Minimum players: {playerMin}</p>
			<p>Maximum players: {playerMax}</p>
		</li>
	);
};

export default SuggestionCard;
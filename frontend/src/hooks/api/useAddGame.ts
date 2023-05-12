import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useAddGame = () => {
	const queryClient = useQueryClient();

	return useMutation<
		unknown,
		AxiosError,
		{
			name: string;
			description: string;
			platform: string;
			releaseDate: string;
			playtime: number;
			playerMin: number;
			playerMax: number;
			location: string;
		}
	>({
		mutationFn: (data) => axios.post('/api/v1/games/add', data),
		onSuccess: () => {
			queryClient.invalidateQueries(['gamesList']);
		}
	});
};
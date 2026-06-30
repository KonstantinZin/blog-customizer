import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowButton } from '../../ui/arrow-button';
import { Button } from '../../ui/button';
import styles from './ArticleParamsForm.module.scss';
import { Select } from '../../ui/select';
import { RadioGroup } from '../../ui/radio-group';
import { Text } from '../../ui/text';
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	ArticleStateType,
	defaultArticleState,
} from '../../constants/articleProps';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onApply: (newState: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	currentState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [localState, setLocalState] =
		useState<ArticleStateType>(defaultArticleState);

	const toggleSidebar = () => {
		setIsOpen((prev) => !prev);
	};

	useEffect(() => {
		if (isOpen) {
			setLocalState(currentState);
		}
	}, [isOpen, currentState]);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={toggleSidebar} />
			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
					}}
					onReset={(e) => {
						e.preventDefault();
					}}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте Параметры
					</Text>

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={localState.fontFamilyOption}
						onChange={(option) =>
							setLocalState((prev) => ({
								...prev,
								fontFamilyOption: option,
							}))
						}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={localState.fontSizeOption}
						onChange={(option) =>
							setLocalState((prev) => ({
								...prev,
								fontSizeOption: option,
							}))
						}
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={localState.fontColor}
						onChange={(option) =>
							setLocalState((prev) => ({
								...prev,
								fontColor: option,
							}))
						}
					/>
					<div style={{ paddingTop: '50px' }}>
						<Select
							title='Цвет фона'
							options={backgroundColors}
							selected={localState.backgroundColor}
							onChange={(option) =>
								setLocalState((prev) => ({
									...prev,
									backgroundColor: option,
								}))
							}
						/>
					</div>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={localState.contentWidth}
						onChange={(option) =>
							setLocalState((prev) => ({
								...prev,
								contentWidth: option,
							}))
						}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={() => {
								setLocalState(defaultArticleState);
								onReset();
							}}
						/>
						<Button
							title='Применить'
							htmlType='submit'
							type='apply'
							onClick={() => {
								onApply(localState);
							}}
						/>
					</div>
				</form>
			</aside>
		</>
	);
};

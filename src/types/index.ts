import { IEvents } from '../components/base/events';

export interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	index?: number;
}

export interface IProductsList {
	items: IItem[];
	preview: string | null;
}

export type IBasket = Pick<IItem, 'title' | 'price'>;

export interface IOrderFormData {
	payment: string;
	address: string;
}

export interface IBuyerInfo {
	email: string;
	phone: string;
}

export type IOrderAndBuyerInfo = IOrderFormData & IBuyerInfo;

export type IOrderData = IOrderAndBuyerInfo & {
	total: number;
	items: string[];
};

export type IFormError = Partial<IOrderAndBuyerInfo>;

export interface IOrderValidation {
	CheckValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

export interface IBuyerInfoValidator {
	CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

export interface ICompletedOrder {
	id: string;
	total: number;
}

export interface IFormSubmissionResult {
	total: number;
}

export interface IAppInfo {
	catalog: IItem[];
	cart: IItem[];
	order: IOrderAndBuyerInfo;
	formError: IFormError;
	events: IEvents;
}

export interface IModal {
	content: HTMLElement;
}

export interface IFormInfo {
	valid: boolean;
	errors: string[];
	address: string;
	payment: string;
	phone: string;
	email: string;
}

export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasketInfo {
	list: HTMLElement[];
	total: number;
}

export interface IPage {
	counter: number;
	productList: HTMLElement[];
}

// export type PaymentType = 'online' | 'cash';

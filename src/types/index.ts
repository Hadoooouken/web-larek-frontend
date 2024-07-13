//интерфес карточки товара

interface IItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// интерфейс заказа
// export interface IOrder {

// }

//выбор наличные или онлайн
type PaymentType = 'online' | 'cash';

//модель данных заказа

export interface IOrderDataModel {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;

}

// данные апи

export interface IApiData {
	fetchProductCards(): Promise<{ items: IItem[] }>;
	fetchProductCard(id: string): Promise<IItem>;
	submitOrder(orderData: IOrderDataModel): Promise<object>;
}

//модель данных корзины
export interface IBasketDataModel {
	addItem(item: Partial<IItem>): void;
	removeItem(item: Partial<IItem>): void;
	clear(): void;
	getItems(): IItem[]; // метод для получения списка товаров
	getTotal(): number; //  метод для получения общей стоимости
}

//представление корзины
export interface IBasketViev {
	render(data?: unknown): HTMLElement;
}

//интерфейс эмиттера

export interface IEventEmitter<T extends string> {
	emit: (event: T, data?: unknown) => void;
}

// данные которые мы передаем в эмиттер
export interface IEventData {
	element: HTMLElement;
	data?: Partial<IItem>;
}

export interface IView {
	render(data?: unknown): HTMLElement;
	toggleClass(element: HTMLElement, className: string): void;
}

export interface IModalView {
	openModal: (element: HTMLElement) => void;
	closeModal: () => void;
}



type EventName = string | RegExp;

type Subscriber = Function;

type EmitterEvent = {
	eventName: string;
	data: unknown;
};



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
export interface IOrder {
	payment: PaymentType;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

//выбор наличные или онлайн
type PaymentType = 'online' | 'cash';

//модель данных заказа

export interface IOrderDataModel {
	buyerFullData: IOrder;
	basket: IBasketDataModel
	// payment: PaymentType;
	// address: string;
	// email: string;
	// phone: string;
	// items: string[];
	// total: number;
	
}

// данные апи

export interface IApiData {
	fetchProductCards(): Promise<{ items: IItem[] }>;
	fetchProductCard(id: string): Promise<IItem>;
	submitOrder(orderData: IOrder): Promise<object>;
}

//модель данных корзины
export interface IBasketDataModel {
	addItem(item: Partial<IItem>): void;
	removeItem(item: Partial<IItem>): void;
	clear(): void;
	// total: number;
	getItems(): IItem[]; // метод для получения списка товаров
	getTotal(): number; //  метод для получения общей стоимости
}

//представление корзины
export interface IBasketUI {
	addItem(item: HTMLElement, itemId: string, sum: number): void;
	removeItem(itemId: string): void;
	clear(): void;
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


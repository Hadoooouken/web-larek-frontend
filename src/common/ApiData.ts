import { Api, ApiListResponse } from '../components/base/api';
import { IItem, ICompletedOrder, IOrderData } from '../types';

export class ApiData extends Api {
	protected _cdn: string;

	constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this._cdn = cdn;
	}

	getProductList(): Promise<IItem[]> {
		return this.get('/product').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: `${this._cdn}${item.image}`,
			}))
		);
	}

	postOrder(orderData: IOrderData): Promise<ICompletedOrder> {
		return this.post(`/order`, orderData).then(
			(orderResult: ICompletedOrder) => orderResult
		);
	}
}

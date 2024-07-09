# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей 
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Типы данных

### Интерфейс карточки

```
interface IItem {
id: string;
description: string;
image: string;
title: string;
category: string;
price: number;
}
```

#### Интерфейс заказа
```
interface IOrder {
payment: PaymentType;
address: string;
email: string;
phone: string;
items: string[];
total: number;
}
```

#### Выбор способа оплаты
```
type PaymentType = 'online' | 'cash';
```

#### Модель данных заказа
```
interface IOrderDataModel {
buyerFullData: IOrder;
payment: PaymentType;
address: string;
email: string;
phone: string;
items: string[];
total: number;
}
```

#### Данные апи сервера
```
export interface IApiData {
fetchProductCards(): Promise<{ items: IItem[] }>;
fetchProductCard(id: string): Promise<IItem>;
submitOrder(orderData: IOrder): Promise<object>;
}
```

#### Модель данных корзины
```
export interface IBasketDataModel {
addItem(item: Partial<IItem>): void;
removeItem(item: Partial<IItem>): void;
clear(): void;
total: number;
}
```

#### Представление корзины
```
export interface IBasketUI {
addItem(item: HTMLElement, itemId: string, sum: number): void;
removeItem(itemId: string): void;
clear(): void;
}
```

#### Интерфейс эмиттера

```
export interface IEventEmitter<T extends string> {
emit: (event: T, data?: unknown) => void;
}
```

#### Данные которые мы передаем в эмиттер

```
export interface IEventData {
element: HTMLElement;
data?: Partial<IItem>;
}
```

#### Архитектура приложения

Код приложения разделён на 3 слоя согласно парадигме MVP:

Слой данных Modal отвечает за хранение и изменение данных, слой представления Viev отвечает за отображение данных на странице, Слой свзи представления и данных осуществляется через событийно ориентированный подход, для него используется класс EventEmitter.

## Классы

#### EventEmitter 

Класс связывает модель данных и модель представления, класс предоставляет механизмы для подписки на события и оповещения подписчиков о их возникновении.
Методы класса включают:

- `on` — устанавливает обработчик для указанного события.
- `off` — удаляет обработчик с указанного события.
- `emit` — инициирует события
- `onAll` — устанавливает обработчик для всех возможных событий.
- `offAll` — удаляет обработчики со всех событий.
- `trigger` — создает специальный коллбек, который при вызове активирует событие.

#### Api

Класс представляет собой универсальный инструмент для взаимодействия с веб-сервисами. Он инкапсулирует логику HTTP-запросов, обеспечивая удобный интерфейс для отправки и получения данных.

- `baseUrl`: Строковая перекменная, хранящая базовый URL веб-сервиса.
- `options`: Объект настроек запроса, включающий заголовки, необходимые для корректной отправки данных.

Конструктор:

- Принимает `baseUrl` и необязательные `options`, инициализируя базовый URL и настройки запроса.

Методы:

- `handleResponse`: Защищенный метод, обрабатывающий ответ от сервера, преобразуя его в JSON и управляя ошибками.
- `get`: Метод для выполнения GET-запроса к указанному URI.
- `post`:- Принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове
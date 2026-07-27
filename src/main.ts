import { API_URL } from './utils/constants';
import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/Base/Api';
import { ApiService } from './components/Services/ApiService';

// === ИНИЦИАЛИЗАЦИЯ КОММУНИКАЦИОННОГО СЛОЯ ===
const apiClient = new Api(API_URL);
const apiService = new ApiService(apiClient);

// === СОЗДАНИЕ ЭКЗЕМПЛЯРОВ КЛАССОВ ===
const productsModel = new ProductCatalog();
const cart = new Cart();
const buyer = new Buyer();

console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ДАННЫХ ===');


// === ТЕСТИРОВАНИЕ ProductCatalog ===
console.log('\n1. ТЕСТИРОВАНИЕ ProductCatalog (каталог товаров)');


// Сохраняем тестовые данные
productsModel.setProducts(apiProducts.items);
console.log('✓ Товары сохранены в каталоге');

// Получаем все товары
const allProducts = productsModel.getProducts();
console.log(`✓ Получено товаров: ${allProducts.length}`);

// Ищем конкретный товар по реальному ID из данных
const firstProduct = allProducts[0];
if (firstProduct) {
  console.log(`✓ Найден товар: "${firstProduct.title}" (ID: ${firstProduct.id})`);
 // Устанавливаем его как выбранный
  productsModel.setSelectedProduct(firstProduct);
  const selected = productsModel.getSelectedProduct();
  console.log(`✓ Выбранный товар: "${selected?.title}"`);
} else {
  console.error('✗ Не удалось найти ни одного товара в каталоге');
}

// === ТЕСТИРОВАНИЕ Cart ===
console.log('\n2. ТЕСТИРОВАНИЕ Cart (корзина)');

// Добавляем товары в корзину, используя реальные ID
if (firstProduct) {
  cart.addItem(firstProduct);
  console.log('✓ Первый товар добавлен в корзину');

  // Добавляем второй товар для проверки подсчётов (если есть хотя бы 2 товара)
  if (allProducts.length > 1) {
    const secondProduct = allProducts[1];
    cart.addItem(secondProduct);
    console.log('✓ Второй товар добавлен в корзину');
  }
}

// Проверяем основные методы корзины
console.log(`✓ Количество товаров в корзине: ${cart.getItemCount()}`);
console.log(`✓ Общая стоимость: ${cart.getTotalPrice()} руб.`);


// Проверка наличия товаров с реальными ID
if (firstProduct) {
  console.log(`✓ Товар с ID "${firstProduct.id}" в корзине: ${cart.hasItem(firstProduct.id)}`);
}
if (allProducts.length > 1) {
  const secondProductId = allProducts[1].id;
  console.log(`✓ Товар с ID "${secondProductId}" в корзине: ${cart.hasItem(secondProductId)}`);
  console.log(`✓ Товар с несуществующим ID "999" в корзине: ${cart.hasItem('999')}`);
}

// Удаляем первый товар и проверяем результат
if (firstProduct) {
  cart.removeItem(firstProduct.id);
  console.log(`✓ После удаления товара с ID "${firstProduct.id}": ${cart.getItemCount()} товаров`);
}

// Очищаем корзину
cart.clear();
console.log(`✓ Корзина очищена. Текущее количество: ${cart.getItemCount()}`);


// === ТЕСТИРОВАНИЕ Buyer ===
console.log('\n3. ТЕСТИРОВАНИЕ Buyer (покупатель)');


// Устанавливаем полные данные
buyer.setData({
  payment: 'online',
  email: 'test@example.com',
  phone: '+79990000000',
  address: 'ул. Примерная, 1'
});
console.log('✓ Данные покупателя установлены');

// Получаем данные
const buyerData = buyer.getData();
console.log('✓ Текущие данные покупателя:', buyerData);


// Проверяем валидацию
const validationErrors = buyer.validate();
if (Object.keys(validationErrors).length === 0) {
  console.log('✓ Валидация пройдена успешно (нет ошибок)');
} else {
  console.error('✗ Ошибки валидации:', validationErrors);
}

// Тестируем валидацию с неполными данными
buyer.clear();
buyer.setData({ email: 'test@example.com' });
const partialValidation = buyer.validate();
console.log('✓ Валидация с неполными данными:');
console.log(partialValidation);

// Финальная очистка
buyer.clear();
console.log('✓ Данные покупателя очищены');

console.log('\n=== ВСЕ ТЕСТЫ ЗАВЕРШЕНЫ ===');
console.log('\n=== ЗАПРОС ДАННЫХ С СЕРВЕРА ===');


async function loadProductsFromServer() {
  try {
    const productsResponse = await apiService.getProducts();
    console.log('✓ Данные с сервера получены успешно');

    // Сохраняем массив товаров в модель каталога
    productsModel.setProducts(productsResponse.items);
    console.log(`✓ В каталог сохранено ${productsResponse.items.length} товаров`);

    // Выводим сохранённый каталог в консоль для проверки
    console.log('\n--- СОХРАНЁННЫЙ КАТАЛОГ ТОВАРОВ ---');
    console.log(productsModel.getProducts());
  } catch (error) {
    console.error('✗ Ошибка при запросе данных с сервера:', error);
  } finally {
    console.log('\n=== ВСЕ ОПЕРАЦИИ ЗАВЕРШЕНЫ ===');
  }
}

// Запускаем асинхронную функцию
loadProductsFromServer();
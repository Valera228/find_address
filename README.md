# Компонент по поиску адреса и его сохранению в инфоблок
Краткое описание работы:
1) Пользователь заходит на страничку
2) Может в спец форму ввести название адреса любого.
3) после ввода 3 буквы и по мере набора текста должна подгружаться подсказка с возможными адресами, которые подходят под введенный текст.
4) Если выбрать адрес из подсказки, то он устанавливается в строку ввода.
5) Рядом есть кнопка "сохранить", нажав на которую указанный адрес сохраняется в базу данных на backend. 
5.1) Если сторонний сервис выдал ошибку - то скидывать ее текст с датой в файл лога. 

!window.VALERA && (window.VALERA = {});

window.VALERA.Address = function () {
    this.__init();
};

window.VALERA.Address.prototype = {

    settings: {
        form: 'form[name="add-address"]',
        input: '#address',
        token: '952a0ee86bbe0c1ade3d9246c4d4dbdd79ff3365',
        bSelectAddress: false
    },

    __init: function() {
        this.initSearch();
        this.__initBinds()
    },

    /**
     * Обработчики событий
     * @private
     */
    __initBinds: function () {
        let self = this;

        /**
         * Сабмит формы
         */
        $('body').on('submit', self.settings.form, function (e) {
            e.preventDefault();
            self.saveAddress(this);
        });

        /**
         * Уберает крусную рамку у инпута
         */
        $('body').on('focusin', self.settings.input, function (e) {
            if ($(this).hasClass("border-danger")) {
                $(this).removeClass("border border-danger");
            }
        });
    },

    /**
     * Вешаем на инпут поиск адреса
     */
    initSearch: function () {
        let self = this;
        $(self.settings.input).suggestions({
            serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
            token: self.settings.token,
            type: "ADDRESS",
            minChars: 3,
            count: 10,
            onSelect: function(suggestion) {
                //inputAddressField.val(suggestion['unrestricted_value']); //Полный адрес
                self.settings.bSelectAddress = true;
            },
            onSelectNothing: function (query) {
                self.settings.bSelectAddress = false;
                console.log('query', query);
            },
            onSearchError: function (query, jqXHR, textStatus, errorThrown) {
                console.log('query', query);
                console.log('jqXHR', jqXHR);
                console.log('textStatus', textStatus);
                console.log('errorThrown', errorThrown);
                self.setAlert($(self.settings.form), "Ошибка стороннего скрипта", "danger");
                self.saveErrorLog(query, textStatus, jqXHR.responseText);
            }
        });
    },

    /**
     * Сохранение закладки
     * @param form
     */
    saveAddress: function (form) {
        console.log('formData', $(form).serializeArray());
        let self = this,
            formData = $(form).serializeArray(),
            $addButton = $(form).find('button[type="submit"]');

        if (!formData.length || (!formData[0].value.length && formData[0].value.length < 3) || !self.settings.bSelectAddress) {
            self.setAlert($(self.settings.form), "Пожалуйста, введите адрес", "danger");
            $(self.settings.input).addClass("border border-danger");
            return;
        }

        $addButton.attr('disabled', 'disabled');
        $addButton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Загрузка...');

        let address = formData[0].value;

        BX.ajax.runComponentAction('valera:search.address',
            'addAddress',
            { // Вызывается без постфикса Action
                mode: 'class',
                data: {
                    post: {
                        ajax: 'Y',
                        address: address
                    }
                }, // ключи объекта data соответствуют параметрам метода
            }).then(function(response) {
                // Успешное завершение скрипта
                console.log('response', response);

                if (response.status === 'success') {
                    let data = response.data;
                    console.log('data', data);

                    if (data.status === "success") {
                        self.setAlert($(form), "Адрес успешно добавлен");
                    } else {
                        self.setAlert($(form), data.message, "danger");
                    }

                    $addButton.removeAttr('disabled');
                    $addButton.html('Добавить');
                }
        }).catch(function(response) {
            // Обработка ошибок
            console.log('response catch', response);
            $addButton.removeAttr('disabled');
            $addButton.html('Сохранить');
            self.setAlert($(form), response.errors[0].message, "danger");
        });
    },

    /**
     * Сохранение лога с ошибками стороннего скрипта
     * @param query
     * @param textStatus
     * @param response
     */
    saveErrorLog: function (query, textStatus, response)
    {
        BX.ajax.runComponentAction('valera:search.address',
            'saveErrorLog',
            { // Вызывается без постфикса Action
                mode: 'class',
                data: {
                    post: {
                        ajax: 'Y',
                        query: query,
                        textStatus: textStatus,
                        response: response,
                    }
                }, // ключи объекта data соответствуют параметрам метода
            }).then(function(response) {
            // Успешное завершение скрипта
            console.log('response', response);
        }).catch(function(response) {
            // Обработка ошибок
            console.log('response catch', response);
        });
    },

    /**
     * Вывод сообщения
     * @param $container
     * @param text
     * @param type
     */
    setAlert: function ($container, text, type = 'success')
    {
        if (type !== 'success') {
            type = 'danger'
        }

        let $dangerAlert = $container.find('#alert-' + type + '-popup');
        if ($dangerAlert.length) {
            $dangerAlert.html(text);
        } else {
            let errorAlert = '<div class="form-row">' +
                    '<div class="col-md-12">' +
                        '<div class="alert alert-' + type + '" id="alert-' + type + '-popup" role="alert">' +
                            text +
                        '</div>' +
                    '</div>' +
                '</div>';
            $container.prepend(errorAlert);
        }
    }
};


BX.ready(function()
{
    $(document).ready(function() {
        new VALERA.Address();
    });
});
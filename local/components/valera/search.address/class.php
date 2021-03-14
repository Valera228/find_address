<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Engine\Contract\Controllerable,
    Bitrix\Main\Diag\Debug,
    Bitrix\Main\Loader,
    Bitrix\Main\Engine\ActionFilter,
    \Bitrix\Main\Type\DateTime;

class SearchAddressComponent extends \CBitrixComponent implements Controllerable
{
    public function onPrepareComponentParams($arParams)
    {
        $arParams['IBLOCK_ID'] = !empty(intval($arParams["IBLOCK_ID"])) ? intval($arParams["IBLOCK_ID"]) : 1;
        return $arParams;
    }

    public function executeComponent()
    {
        $this->includeComponentTemplate();
    }

    /**
     * Добавление закладки
     * @param $post - данные ajax запроса
     * @return array
     * @throws Exception
     */
    public function addAddressAction($post): array
    {
        Loader::includeModule('iblock');
        if ($post['ajax'] == "Y" && !empty($post['address']) && strlen($post['address']) > 2)
        {
            $address = filter_var($post['address'], FILTER_SANITIZE_STRING);

            if (!empty($address)) {
                $oIblockElm = new \CIBlockElement();
                $aFields = [
                    "IBLOCK_ID" => $this->arParams["IBLOCK_ID"],
                    "NAME" => $address
                ];
                $iAddressId = $oIblockElm->add($aFields);
                if ($iAddressId)
                    return [
                        "ID" => $iAddressId,
                        "status" => "success"
                    ];
                else
                    throw new Exception('Адрес не добавлен. Ошибка ' . $oIblockElm->LAST_ERROR);
            } else {
                throw new Exception("Адрес и/или инфоблок $address не заполнены " . $this->arParams["IBLOCK_ID"]);
            }
        } else {
            throw new Exception('Неверные параметры запроса');
        }
    }

    /**
     * Логирование ошибок
     * @param $post - данные ajax запроса
     * @return bool
     * @throws Exception
     */
    public function saveErrorLogAction($post): bool
    {
        if ($post['ajax'] == "Y" && !empty($post['query']) && !empty($post['textStatus']) && !empty($post['response']))
        {
            $dateTime = (new DateTime())->format("Y-m-d H:i:s");
            $sErrorMessage = "$dateTime Ошибка '{$post['textStatus']}' запроса '{$post['query']}'";
            Debug::writeToFile($post['response'], $sErrorMessage, "address_error.log");
        } else {
            throw new Exception('Неверные параметры запроса');
        }

        return true;
    }

    /**
     * Конфигурация ajax запросов
     * @inheritDoc
     */
    public function configureActions(): array
    {
        // Сбрасываем фильтры по-умолчанию (ActionFilter\Authentication и ActionFilter\HttpMethod)
        // Предустановленные фильтры находятся в папке /bitrix/modules/main/lib/engine/actionfilter/
        return [
            'sendMessage' => [ // Ajax-метод
                'prefilters' => [
                    new ActionFilter\HttpMethod([
                        ActionFilter\HttpMethod::METHOD_POST
                    ])
                ],
            ],
        ];
    }
}
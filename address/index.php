<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Добавление адреса");
?><?$APPLICATION->IncludeComponent(
	"valera:search.address",
	"",
		[
		    "IBLOCK_ID" => "1"
        ]

);?><? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>
<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);

CJSCore::Init(array('jquery2'));
$this->addExternalCss("https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css");
$this->addExternalJS("https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js");
$this->addExternalJS('//cdn.jsdelivr.net/jquery.suggestions/16.8/js/jquery.suggestions.min.js');
$this->addExternalCss('//cdn.jsdelivr.net/jquery.suggestions/16.8/css/suggestions.css');
?>

<div class="container">
    <div class="row">
        <form name="add-address">
            <div class="form-row">
                <div class="col-md-12 mb-4">
                    <input type="text" class="form-control" id="address" name="address" placeholder="Введите адрес">
                </div>
            </div>
            <div class="form-row">
                <div class="col-md-12 mt-2">
                    <button type="submit" class="btn btn-primary">Сохранить</button>
                </div>
            </div>
        </form>
    </div>
</div>
window.disabledScroll = function () {
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    // console.log(widthScroll);
    // Запоминаем координати на которых было вызвано модальное окно
    // В document.body добавляем значение dbscrollY(мы его придумали)
    // console.dir(document.body);
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
        position: relative;
        top: ${window.scrollY}px;
        left: 0;
        width:100%;
        overflow: hidden;
        height: 100vh;
        padding-right: ${widthScroll}px;
    `;
}

window.enableScroll = function () {
    document.body.style.cssText = ``;
    // функция скрола страницы на значение document.body.dbScrollY
    window.scroll({ top: document.body.dbScrollY });
}
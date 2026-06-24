export const flyToCart = (
    imageElement
) => {
    const cartIcon =
        document.getElementById(
            "cart-icon"
        );


    if (!imageElement || !cartIcon)
        return;

    const imageRect =
        imageElement.getBoundingClientRect();

    const cartRect =
        cartIcon.getBoundingClientRect();

    const clone =
        imageElement.cloneNode(true);

    clone.style.position = "fixed";
    clone.style.left =
        imageRect.left + "px";
    clone.style.top =
        imageRect.top + "px";

    clone.style.width =
        imageRect.width + "px";

    clone.style.height =
        imageRect.height + "px";

    clone.style.objectFit = "cover";

    clone.style.zIndex = "9999";

    clone.style.transition =
        "all 0.8s cubic-bezier(.17,.67,.43,1.3)";

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
        clone.style.left =
            cartRect.left + "px";

        clone.style.top =
            cartRect.top + "px";

        clone.style.width = "30px";
        clone.style.height = "30px";

        clone.style.opacity = "0.3";
        clone.style.transform =
            "scale(0.2)";
    });

    setTimeout(() => {
        clone.remove();
        cartIcon.classList.add(
            "cart-bounce"
        );

        setTimeout(() => {
            cartIcon.classList.remove(
                "cart-bounce"
            );
        }, 400);
    }, 800);


};

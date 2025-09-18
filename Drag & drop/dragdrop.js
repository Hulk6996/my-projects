const dragDrop = document.querySelector('.item');
const placeholders = document.querySelectorAll('.placeholder');
dragDrop.addEventListener('dragstart', dragStart);
dragDrop.addEventListener('dragend', dragEnd);
function dragStart(event){
    event.target.classList.add('hold');
    setTimeout(() => event.target.classList.add('hide'), 0);
};
function dragEnd(event){
    event.target.classList.remove('hold', 'hide');
}
placeholders.forEach((placeholder) => {
    placeholder.addEventListener('dragover', dragOver);
    placeholder.addEventListener('dragenter', dragEnter);
    placeholder.addEventListener('dragleave', dragLeave);
    placeholder.addEventListener('drop', dragdrop);
});
function dragOver(event){
    event.preventDefault();
}
function dragEnter(event){
    event.target.classList.add('hovered');
}
function dragLeave(event){
    event.target.classList.remove('hovered');
}
function dragdrop(event){
    event.target.append(dragDrop);
    event.target.classList.remove('hovered');
}

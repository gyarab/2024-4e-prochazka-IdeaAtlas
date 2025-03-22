export function useDraggable() {
  const startDrag = (event: MouseEvent, element: HTMLElement) => {
    const initialX = event.clientX - element.offsetLeft;
    const initialY = event.clientY - element.offsetTop;

    const handleMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - initialX;
      const newY = moveEvent.clientY - initialY;
      
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { startDrag };
}

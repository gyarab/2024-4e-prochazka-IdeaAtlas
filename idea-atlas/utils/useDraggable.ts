export function useDraggable() {
  const startDrag = (event: MouseEvent, element: HTMLElement, onPositionChange: (x: number, y: number) => void) => {
    // Calculate the initial position from the element's current position
    const currentX = parseInt(element.style.left) || 0;
    const currentY = parseInt(element.style.top) || 0;
    
    // Calculate the offset from where we clicked relative to the current position
    const offsetX = event.clientX - currentX;
    const offsetY = event.clientY - currentY;

    const handleMove = (moveEvent: MouseEvent) => {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;
      
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      onPositionChange(newX, newY);
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

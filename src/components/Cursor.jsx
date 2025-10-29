import { useEffect } from 'react';

const Cursor = () => {
  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
      }
      
      setTimeout(() => {
        if (cursorFollower) {
          cursorFollower.style.left = e.pageX + 'px';
          cursorFollower.style.top = e.pageY + 'px';
        }
      }, 100);
    };

    document.addEventListener('mousemove', moveCursor);
    
    return () => document.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div className="cursor" />
      <div className="cursor-follower" />
    </>
  );
};

export default Cursor;
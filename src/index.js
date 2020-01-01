const defalutOptions = {
  elem: document.documentElement,
  onDragEnd: null,
};

class DragScroll {
  constructor(options) {
    const opt = { ...defalutOptions, ...options };

    this.dragScrollElem = opt.elem;
    this.onDragEnd = opt.onDragEnd;
  }

  init = () => {
    this.pushed = false;
    this.mouseMoving = false;
    this.mouseMovingTimeoutId = null;

    this.lastClientX = null;
    this.lastClientY = null;

    // capture click events
    this.dragScrollElem.addEventListener(
      'click',
      this._captureClickEvents,
      true
    );
    ['mousedown', 'touchstart'].forEach(eventName => {
      this.dragScrollElem.addEventListener(eventName, this._onMouseDown, true);
    });
    ['mousemove', 'touchmove'].forEach(eventName => {
      this.dragScrollElem.addEventListener(eventName, this._onMouseMove);
    });
    ['mouseup', 'touchend'].forEach(eventName => {
      this.dragScrollElem.addEventListener(eventName, this._onMouseUp);
    });
    this.dragScrollElem.addEventListener('scroll', e => {
      this.lastClientX = this.dragScrollElem.scrollLeft - this.lastClientX;
      this.lastClientY = this.dragScrollElem.scrollTop - this.lastClientY;
    });
  };

  _captureClickEvents = e => {
    if (this.mClickEnabled) return;

    e.preventDefault();
    e.stopPropagation();
  };

  _onMouseDown = e => {
    this.mClickEnabled = false;
    this.mouseMoving = false;
    this.mouseMovingTimeoutId = null;

    // handle mousedown events
    if (e.type.toLowerCase() === 'mousedown') {
      this.lastClientX = e.pageX;
      this.lastClientY = e.pageY;

      // only handle the mouse left button
      if (e.button !== 0) return;
    }
    // handle touchstart event
    else {
      this.lastClientX = e.changedTouches[0].pageX;
      this.lastClientY = e.changedTouches[0].pageY;
    }

    this.pushed = true;

    e.preventDefault();
    e.stopPropagation();
  };

  _onMouseMove = e => {
    if (!this.pushed) {
      return;
    }

    // detect the movement with a bit delay
    if (!this.mouseMovingTimeoutId) {
      this.mouseMovingTimeoutId = setTimeout(() => {
        this.mouseMoving = true;
      }, 70);
    }

    let clientX, clientY;

    // handle mousemove events
    if (e.type.toLowerCase() === 'mousemove') {
      clientX = e.pageX;
      clientY = e.pageY;
    }
    // handle touchmove event
    else {
      clientX = e.changedTouches[0].pageX;
      clientY = e.changedTouches[0].pageY;
    }

    if (this.lastClientX !== clientX) {
      this.dragScrollElem.scrollLeft += this.lastClientX - clientX;
    }

    if (this.lastClientY !== clientY) {
      this.dragScrollElem.scrollTop += this.lastClientY - clientY;
    }
  };

  _onMouseUp = e => {
    if (!this.pushed) {
      return;
    }

    this.pushed = false;

    // tapping detected
    if (!this.mouseMoving) {
      this.mClickEnabled = true;
    }

    this.onDragEnd && this.onDragEnd();
  };
}

export default DragScroll;

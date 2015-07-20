import Ember from 'ember';

export default Ember.Mixin.create({
  resizing: false,
  resizeDelay: 200,
  /**
   * Recursively traverse view tree looking for parent element that has a handler bound to
   */
  findResizableParentView: function (parent) {
    if (Ember.isNone(parent)) {
      return null;
    }
    if (parent && !parent.has('resize')) {
      return this.findResizableParentView(parent.get('parentView'));
    }
    return parent;
  },
  /**
   * Bind resizeHandler either to the parent view or window
   */
  _setupResizeHandlers: function () {
    var resizeHandler = this.get('_handleResize');
    var parent = this.findResizableParentView(this.get('parentView'));
    if (Ember.isNone(parent)) {
      resizeHandler = Ember.$.proxy(resizeHandler, this);
      // element doesn't have resizable views, so bind to the window
      Ember.$(window).on("resize." + this.elementId, resizeHandler);
      this._resizeHandler = resizeHandler;
    } else {
      parent.on('resize', this, resizeHandler);
    }
  }.on('didInsertElement'),
  /**
   * Unbind from window if window binding was used
   */
  _removeResizeHandlers: function () {
    if (this._resizeHandler) {
      Ember.$(window).off("resize." + this.elementId, this._resizeHandler);
    }
  }.on('willDestroyElement'),
  /**
   * Triggers resize events
   * Promise allows to chain events so async operations happen in sequence
   * @param event
   * @param promise
   * @private
   */
  _handleResize: function (event, promise) {
    if (Ember.isNone(promise)) {
      promise = Ember.RSVP.resolve(null, "Resize handler");
    }
    if (!this.get('resizing')) {
      this.set('resizing', true);
      if (this.has('resizeStart')) {
        this.trigger('resizeStart', event);
      }
    }
    if (this.has('resize')) {
      this.trigger('resize', event, promise);
    }
    Ember.run.debounce(this, this._endResize, event, this.get('resizeDelay'));
  },
  /**
   * Ends resizing by triggering resizeEnd event
   * @param event
   * @private
   */
  _endResize: function (event) {
    if (this.get('isDestroyed')) {
      return;
    }
    this.set('resizing', false);
    if (this.has('resizeEnd')) {
      this.trigger('resizeEnd', event);
    }
  }
});

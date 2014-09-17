# ember-resize-mixin

Ember Resize Mixin allows child views to resize after parent view was resized.

## Use

```javascript
import ResizeMixin from 'ember-resize-mixin/main';

export default View.extend(ResizeMixin, {
  /**
   * Trigger this function when parent (or window) is resized. Property name does not matter.
   */
  onResize: function() {
    // do what you want when resize is triggered
  }.on('resize')
});
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

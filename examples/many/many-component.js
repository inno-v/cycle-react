var h = Cycle.h;

function manyComponent(interactions, props) {
  var id$ = props.get('itemid').shareReplay(1);
  var color$ = props.get('color').startWith('#888').shareReplay(1);
  var width$ = props.get('width').startWith(200).shareReplay(1);
  var vtree$ = Cycle.Rx.Observable
    .combineLatest(id$, color$, width$, function (id, color, width) {
      var style = {
        border: '1px solid #000',
        background: 'none repeat scroll 0% 0% ' + color,
        width: width + 'px',
        height: '70px',
        display: 'block',
        padding: '20px',
        margin: '10px 0px'
      };
      return h('div.item', {style: style}, [
        h('input.color-field', {
          type: 'text',
          value: color
        }),
        h('div.slider-container', [
          h('input.width-slider', {
            type: 'range', min: '200', max: '1000',
            value: width
          })
        ]),
        h('div.width-content', String(width)),
        h('button.remove-btn', 'Remove')
      ]);
    });
  var destroy$ = interactions.get('.remove-btn', 'click')
      .withLatestFrom(id$, function (ev, id) { return id; });
  var changeColor$ = interactions.get('.color-field', 'input')
      .withLatestFrom(id$, function (ev, id) {
        return {id: id, color: ev.currentTarget.value};
      });
  var changeWidth$ = interactions.get('.width-slider', 'input')
      .withLatestFrom(id$, function (ev, id) {
        return {id: id, width: parseInt(ev.currentTarget.value)};
      });

  return {
    vtree$: vtree$,
    destroy$: destroy$,
    changeColor$: changeColor$,
    changeWidth$: changeWidth$
  };
}

var ManyItem = Cycle.createReactClass('ManyItem', manyComponent);

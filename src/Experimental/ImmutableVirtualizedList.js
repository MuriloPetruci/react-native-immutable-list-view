import Immutable from 'immutable';
import React, { PureComponent } from 'react';
import { View } from 'react-native';

import utils from '../utils';

function optionalRequire(module) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(module);
  } catch (error) {
    console.error('Error: VirtualizedList could not be imported.' +
      ' Please make sure you\'ve downloaded it along with its other dependencies.' +
      ' See the react-native-immutable-list-view README for instructions.', error);

    return () => <View />;
  }
}

const VirtualizedList = optionalRequire('react-native/Libraries/Experimental/VirtualizedList');

/**
 * A VirtualizedList capable of displaying {@link https://facebook.github.io/immutable-js/ Immutable} data
 * out of the box.
 */
// eslint-disable-next-line react/prefer-stateless-function
class ImmutableVirtualizedList extends PureComponent {

  static propTypes = {
    // Pass through any props that VirtualizedList would normally take.
    ...VirtualizedList.propTypes,

    /**
     * The immutable data to be rendered in a VirtualizedList.
     */
    // eslint-disable-next-line consistent-return
    immutableData: (props, propName, componentName) => {
      // Note: It's not enough to simply validate PropTypes.instanceOf(Immutable.Iterable),
      // because different imports of Immutable.js across files have different class prototypes.
      // TODO: Add support for Immutable.Map, etc.
      if (Immutable.Map.isMap(props[propName])) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}: Support for Immutable.Map is coming soon. For now, try an Immutable List, Set, or Range.`);
      } else if (!utils.isImmutableIterable(props[propName])) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}: Must be instance of Immutable.Iterable.`);
      }
    },
  };

  render() {
    const { immutableData } = this.props;

    return (
      <VirtualizedList
        data={immutableData}
        getItem={(items, index) => utils.getValueFromKey(index, items)}
        getItemCount={(items) => (items.size || items.length)}
        keyExtractor={(item, index) => String(index)}
        {...this.props}
      />
    );
  }

}

export default ImmutableVirtualizedList;
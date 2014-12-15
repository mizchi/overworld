export interface Case<T, U> {
  next( cond: ( arg: T ) => boolean, result: () => U ): Case<T, U>;
  next( cond: any, result: () => U ): Case<T, U>;
  end( result: () => U ): U;
}

export function match<T, U>( target: T ): Case<T, U> {
  var _result: U;
  var flg: boolean;

  function next( cond, exp ) {
    if ( typeof cond === "function" && target instanceof cond ) {
      _result = exp();
      flg = true;
    } else if ( typeof cond === "function" && cond( target ) ) {
      _result = exp();
      flg = true;
    } else if ( target === cond ) {
      _result = exp();
      flg = true;
    }
    if ( flg ) {
      return {
        next: finished,
        end: end
      };
    }
    return {
      next: next,
      end: end
    };
  }

  function finished() {
    return {
      next: finished,
      end: end
    }
  }

  function end( exp ) {
    return flg ? _result : exp();
  }

  return {
    next: next,
    end: end
  };
}

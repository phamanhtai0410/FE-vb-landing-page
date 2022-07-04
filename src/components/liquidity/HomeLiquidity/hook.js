import { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "../../../actions";
import RouteName from "../../../constants/routeName.constants";
import { selectUsersAddedPoolAddresses } from "../../../reducers/userAssetPools.reducer";
import { selectWeb3 } from "../../../reducers/web3.reducer";

const useLiquidityFacade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {web3} = useSelector(selectWeb3, shallowEqual);
  const userPoolAddresses = useSelector(selectUsersAddedPoolAddresses);

  const addLiquidity = () => {
    navigate(RouteName.ADD_LIQUIDITY);
  }

  const onFindOtherLPClicked = () => navigate(RouteName.POOL);

  useEffect(() => {
    if (web3) {
      fetchPoolAssets();
    }
  }, [web3]);

  async function fetchPoolAssets() {
    await dispatch(actions.getPoolAssets());
  }

  return {
    userPoolAddresses,
    addLiquidity,
    onFindOtherLPClicked,
  };
};

export default useLiquidityFacade;

import * as React from "react";
import { Route } from "react-router-dom";
import Header from "src/components/Header";
import Wallet from "src/containers/Wallet";
import loadWASM from "src/services/wasm";
import FullScreenLoading from "src/components/Loading/FullScreenLoading";
import { loadWalletAction } from "src/redux/actions";
import { RootState } from "src/redux/reducers";
import { connect } from "react-redux";
import Settings from "src/containers/Settings";
type Props = {
  loadWallet: Function;
  wallet: any;
};

const App: React.FunctionComponent<Props> = ({ loadWallet, wallet }) => {
  const [loadedWASM, setLoadedWASM] = React.useState(false);

  React.useEffect(() => {
    const loadWebAssembly = async () => {
      await loadWASM();
      setLoadedWASM(true);
      loadWallet();
    };

    loadWebAssembly();
  }, [loadWallet]);

  React.useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await wallet.listAccount();
      console.debug("ACCOUNTS", accounts);
    };

    if (wallet) {
      loadAccounts();
    }
  }, [wallet]);

  if (!loadedWASM) {
    return <FullScreenLoading />;
  }

  return (
    <div className="App">
      <Header />
      <div className="app-content">
        <Route exact path="/" component={Wallet} />
        <Route exact path="/wallet/settings" component={Settings} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.walletReducer.loading,
  wallet: state.walletReducer.wallet,
  error: state.walletReducer.error
});

const mapDispatchToProps = {
  loadWallet: loadWalletAction
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

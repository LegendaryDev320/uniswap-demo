import React from "react";
import "./App.css";
import { ApolloClient } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const DAI_QUERY = gql`
  query tokens($tokenAddress: String!) {
    tokens(id: $tokenAddress) {
      derivedETH
      totalLiquidity
    }
  }
`;

const ETH_PRICE_QUERY = gql`
  query ethPrice {
    bundle(id: "1") {
      ethPrice
    }
  }
`;

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  }),
  cache: new InMemoryCache(),
});

function App() {
  const {
    loading: ethLoading,
    error,
    data: ethPriceData,
  } = useQuery(ETH_PRICE_QUERY);

  const {
    loading: daiLoading,
    error: daiError,
    data: daiData,
  } = useQuery(DAI_QUERY, {
    variables: {
      tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
  });
  if (daiData == undefined || ethPriceData == undefined) {
    if (error) console.log(error.message);
    if (daiError) console.log(daiError.message);
    return <div>Error</div>;
  }
  const daiPriceInEth = daiData && daiData.tokens[0].derivedETH;
  const daiTotalLiquidity = daiData && daiData.tokens[0].totalLiquidity;
  const ethPriceInUSD = ethPriceData && ethPriceData.bundle.ethPrice;

  return (
    <div>
      <div>
        Dai price:{" "}
        {ethLoading || daiLoading
          ? "Loading token data ..."
          : "$" +
            (parseFloat(daiPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
      </div>
      <div>
        Dai total liquidity:{" "}
        {daiLoading
          ? "Loading token data..."
          : parseFloat(daiTotalLiquidity).toFixed(0)}
      </div>

      <iframe
        src="https://app.uniswap.org/#/swap?outputCurrency=0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
        height="660px"
        width="100%"
        style={{border: 0, margin: '0 auto', display: 'block', borderRadius: '10px', maxWidth: '600px', minWidth: '300px'}}
      />
    </div>
  );
}

export default App;

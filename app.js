import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, SafeAreaView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

function FinanceChart() {
  const screenWidth = Dimensions.get("window").width;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exemplo usando Alpha Vantage (substitua pela sua chave de API)
    const API_KEY = "SUA_CHAVE_API";
    const SYMBOL = "BOVA11.SAO"; // Exemplo de ETF do Ibovespa
    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${SYMBOL}&interval=60min&apikey=${API_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        const timeSeries = json["Time Series (60min)"];
        if (timeSeries) {
          const labels = [];
          const values = [];
          Object.entries(timeSeries)
            .slice(0, 6)
            .reverse()
            .forEach(([time, value]) => {
              labels.push(time.split(" ")[1].slice(0, 5));
              values.push(Number(value["4. close"]));
            });
          setData({
            labels,
            datasets: [
              {
                data: values,
                strokeWidth: 3,
                color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              },
            ],
          });
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  if (!data) {
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Erro ao carregar dados.</Text>;
  }

  return (
    <View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        Índice Bovespa (Tempo Real)
      </Text>
      <LineChart
        data={data}
        width={screenWidth - 16}
        height={280}
        yAxisLabel="R$ "
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f5f5f5",
          backgroundGradientTo: "#f5f5f5",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#007bff",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          alignSelf: "center",
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}>
      <FinanceChart />
    </SafeAreaView>
  );
}

import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
/**
 * Centraliza o app vertical e horizontalmente
 * Diminui o tamanho do app
 * Adiciona um botão para atualizar câmbio e notícias
 */
const APP_WIDTH = 50;
const APP_PADDING = 20;
// No styles.main, adicione largura máxima e padding
// (isso deve ser feito no objeto styles, mas como só pode alterar aqui, adicione as constantes acima)
type ExchangeRates = {
  USD: number;
  EUR: number;
};

type NewsItem = {
  symbol: string;
  longName: string;
  price: number;
  changePercent: number;
};


// Hook para buscar notícias financeiras de uma API gratuita (NewsData.io)
// Exemplo de chamada de API para notícias financeiras do dia:
// fetch("https://newsapi.org/v2/top-headlines?category=business&language=pt")
//   .then(res => res.json())
//   .then(data => console.log(data));

export default function Page() {
  const [exchange, setExchange] = useState<ExchangeRates | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Buscar câmbio
    fetch("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.USDBRL && data.EURBRL) {
          setExchange({
            USD: Number(data.USDBRL.ask),
            EUR: Number(data.EURBRL.ask),
          });
        } else {
          setExchange(null);
        }
      })
      .catch(() => setExchange(null));

    // Buscar notícias/ações
    fetch("https://brapi.dev/api/quote/PETR4,VALE3,MGLU3?range=1mo&interval=1d")
      .then((res) => res.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          setNews(
            data.results.map((stock: any) => ({
              symbol: stock.symbol,
              longName: stock.longName,
              price: stock.regularMarketPrice,
              changePercent: stock.regularMarketChangePercent,
            }))
          );
        } else {
          setNews([]);
        }
      })
      .catch(() => setNews([]));
  }, []);

  // Troque o View externo por ScrollView para permitir rolagem e centralização
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.main}>
        <Text style={[{ fontSize: 26, fontWeight: "bold", color: "#432e7dff", textAlign: "center", marginBottom: 8 }]}>
          flyfinace App
        </Text>
        <Text style={styles.subtitle}>
          Controle suas finanças, veja cotação e notícias
        </Text>
        <View style={{ marginTop: 32, width: "100%" }}>
          <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 8,
          color: "#1565C0",
          textAlign: "center",
        }}
          >
        Saldo: R$ 2.500,00
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 4, color: "#43A047", textAlign: "center" }}>
        Entradas: R$ 3.000,00
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 16, color: "#D32F2F", textAlign: "center" }}>
        Saídas: R$ 500,00
          </Text>
          <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 8,
          color: "#6D4C41",
          textAlign: "center",
        }}
          >
        Últimas transações
          </Text>
          <View
        style={{
          backgroundColor: "#E8F5E9",
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
          >
        <Text style={{ color: "#263238" }}>Mercado - R$ 200,00</Text>
        <Text style={{ color: "#D32F2F" }}>Saída</Text>
          </View>
          <View
        style={{
          backgroundColor: "#E3F2FD",
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
          >
        <Text style={{ color: "#263238" }}>Salário - R$ 3.000,00</Text>
        <Text style={{ color: "#388E3C" }}>Entrada</Text>
          </View>
          {/* Complemento: Câmbio */}
          <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 8,
          color: "#0277BD",
          textAlign: "center",
        }}
          >
        Câmbio
          </Text>
          <View
        style={{
          backgroundColor: "#FFFDE7",
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
          >
        <Text style={{ color: "#263238" }}>
          USD/BRL: {exchange ? exchange.USD.toFixed(2) : "Carregando..."}
        </Text>
        <Text style={{ color: "#263238" }}>
          EUR/BRL: {exchange ? exchange.EUR.toFixed(2) : "Carregando..."}
        </Text>
          </View>
          {/* Complemento: Notícias da Bolsa */}
          <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 8,
          color: "#C62828",
          textAlign: "center",
        }}
          >
        Notícias da Bolsa
          </Text>
          <View
        style={{ backgroundColor: "#FFEBEE", padding: 12, borderRadius: 8 }}
          >
        {news.length === 0 ? (
          <Text style={{ color: "#263238" }}>Carregando notícias...</Text>
        ) : (
          news.map((item, idx) => (
            <View key={item.symbol} style={{ marginBottom: 8 }}>
          <Text style={{ color: "#263238", fontWeight: "bold" }}>
            {item.longName}
          </Text>
          <Text style={{ color: "#263238" }}>
            Preço: R$ {item.price.toFixed(2)}
          </Text>
          <Text style={{ color: "#263238" }}>
            Código: {item.symbol}
          </Text>
          <Text style={{ color: item.changePercent >= 0 ? "#388E3C" : "#D32F2F" }}>
            {item.changePercent >= 0 ? "▲" : "▼"} {item.changePercent.toFixed(2)}%
          </Text>
            </View>
          ))
        )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f6fa",
    alignItems: "center",
    justifyContent: "center",
    padding: APP_PADDING / 5,
    minHeight: "100%",
  },
  main: {
    width: "100%",
    maxWidth: APP_WIDTH - 150, // diminui ainda mais a largura
    padding: APP_PADDING,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 0,
    alignSelf: "center",
    marginBottom: 6,
    },
    subtitle: {
    fontSize: 20, // diminui o tamanho da fonte
    color: "#282c30ff",
    textAlign: "center",
    marginBottom: 12,
  },
  financeImage: {
    width: 50, // diminui o tamanho da imagem
    height: 60,
    alignSelf: "center",
    marginBottom: 12,
    borderRadius: 12,
  },
});

// Substitua o View externo por ScrollView no seu componente principal:
// <ScrollView contentContainerStyle={styles.container}>
//   <View style={styles.main}>...</View>
// </ScrollView>

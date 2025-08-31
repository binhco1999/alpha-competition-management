import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { symbol } = req.query;

    if (!symbol || typeof symbol !== 'string') {
      res.status(400).json({ error: 'Symbol parameter is required' });
      return;
    }

    const pair = symbol.toUpperCase() + "USDT";
    const mexcUrl = `https://api.mexc.com/api/v3/ticker/price?symbol=${pair}`;

    // Try MEXC first with timeout
    try {
      const mexcController = new AbortController();
      const mexcTimeout = setTimeout(() => mexcController.abort(), 5000); // 5 second timeout

      const mexcResponse = await fetch(mexcUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AlphaCompetition/1.0)',
        },
        signal: mexcController.signal
      });

      clearTimeout(mexcTimeout);

      if (mexcResponse.ok) {
        const mexcData = await mexcResponse.json();

        // Debug: Log the MEXC response
        console.log('MEXC API Response:', JSON.stringify(mexcData));

        // Check if MEXC returned an error response
        if (mexcData.error || mexcData.msg) {
          console.log('MEXC API returned error:', mexcData.error || mexcData.msg);
          throw new Error(`MEXC API error: ${mexcData.error || mexcData.msg}`);
        }

        // Check if MEXC returned an empty response (for non-existent pairs)
        if (!mexcData || Object.keys(mexcData).length === 0) {
          console.log('MEXC API returned empty response - pair may not exist');
          throw new Error('Trading pair not found on MEXC');
        }

        // Validate MEXC v3 API response data
        console.log('Checking MEXC data:', {
          hasSymbol: !!mexcData?.symbol,
          hasPrice: !!mexcData?.price,
          symbol: mexcData?.symbol,
          price: mexcData?.price
        });

        if (mexcData?.symbol && mexcData?.price) {
          // Transform v3 response to match expected format
          const transformedData = {
            code: 200,
            data: [{
              symbol: mexcData.symbol.replace('USDT', '_USDT'),
              last: String(mexcData.price),
              volume: '0', // Price API doesn't provide volume
              high: '0',   // Price API doesn't provide high
              low: '0',    // Price API doesn't provide low
              change: '0', // Price API doesn't provide change
              change_rate: '0', // Price API doesn't provide change rate
              source: 'mexc'
            }]
          };
          console.log('Sending transformed MEXC data:', JSON.stringify(transformedData));
          res.status(200).json(transformedData);
          return;
        } else {
          console.log('MEXC API returned invalid data, trying Bybit...');
        }
      } else {
        console.log(`MEXC API responded with status: ${mexcResponse.status}, trying Bybit...`);
      }
    } catch (mexcError) {
      console.log('MEXC API failed, trying Bybit...', mexcError);
    }

    // Fallback to Bybit if MEXC fails
    const bybitSymbol = symbol.toUpperCase() + "USDT";
    const bybitUrl = `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${bybitSymbol}`;

    try {
      const bybitController = new AbortController();
      const bybitTimeout = setTimeout(() => bybitController.abort(), 5000); // 5 second timeout

      const bybitResponse = await fetch(bybitUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AlphaCompetition/1.0)',
        },
        signal: bybitController.signal
      });

      clearTimeout(bybitTimeout);

      if (!bybitResponse.ok) {
        throw new Error(`Bybit API responded with status: ${bybitResponse.status}`);
      }

      const bybitData = await bybitResponse.json();

      // Transform Bybit response to match MEXC format
      if (bybitData.retCode === 0 && bybitData.result.list && bybitData.result.list.length > 0) {
        const ticker = bybitData.result.list[0];

        // Validate the data before transforming
        if (ticker.lastPrice && parseFloat(ticker.lastPrice) > 0) {
          const transformedData = {
            code: 200,
            data: [{
              symbol: ticker.symbol.replace('USDT', '_USDT'),
              last: String(ticker.lastPrice), // Use 'last' to match MEXC format
              volume: String(ticker.volume24h),
              high: String(ticker.highPrice24h),
              low: String(ticker.lowPrice24h),
              change: String(ticker.price24hPcnt),
              change_rate: String(ticker.price24hPcnt), // Use 'change_rate' to match MEXC format
              source: 'bybit'
            }]
          };
          res.status(200).json(transformedData);
          return;
        } else {
          throw new Error('Invalid price data from Bybit API');
        }
      } else {
        throw new Error('Invalid response from Bybit API');
      }
    } catch (bybitError) {
      console.error('Bybit API also failed:', bybitError);
      throw new Error('Both MEXC and Bybit APIs failed');
    }

  } catch (error) {
    console.error('Error fetching price data:', error);
    res.status(500).json({
      error: 'Failed to fetch price data from both MEXC and Bybit',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
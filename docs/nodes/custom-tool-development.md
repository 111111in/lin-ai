# 自定义工具开发（Custom Tool Development）

本指南全面介绍如何在 AgentDock 中编写**自定义工具**，并给出完整示例和最佳实践。

## 简介

自定义工具可以扩展智能体的能力，让其执行更加专门的任务，例如：  
搜索网页、分析数据、调用外部业务系统 API 等。  
从架构角度看，工具是一类「专用节点」，遵循统一的结构，便于编写与维护。

## 参考实现中的目录结构

在参考实现中，工具的目录组织通常如下：

```
src/nodes/[tool-name]/
├── index.ts        # Main tool implementation
├── components.tsx  # React components for output
└── utils.ts        # Helper functions (optional)
```

## 完整示例：天气查询工具

下面以一个「天气预报工具」为例，展示从目录到实现的完整流程。

### 第一步：创建目录结构

```
src/nodes/weather/
├── index.ts        # Main implementation
├── components.tsx  # Output formatting
└── utils.ts        # API utilities
```

### 第二步：实现工具逻辑

```typescript
// index.ts
import { z } from 'zod';
import { Tool } from '../types';
import { logger, LogCategory } from '@/lib/logger';
import { createToolResult, formatErrorMessage } from '@/lib/utils/markdown-utils';
import { WeatherForecast } from './components';
import { fetchWeatherData } from './utils';

// Parameter schema for the weather tool
const weatherSchema = z.object({
  location: z.string().describe('City name or location to get weather for'),
  days: z.number().optional().default(3).describe('Number of days to forecast (1-7)')
});

// Weather tool implementation
export const weatherTool: Tool = {
  name: 'weather',
  description: 'Get weather forecast for any location',
  parameters: weatherSchema,
  async execute({ location, days = 3 }, options) {
    try {
      // Validate input
      if (!location) {
        return createToolResult(
          'weather_error',
          formatErrorMessage('Error', 'Location is required')
        );
      }

      // Limit days to a reasonable range
      const forecastDays = Math.min(Math.max(days, 1), 7);
      
      // Fetch weather data
      const weatherData = await fetchWeatherData(location, forecastDays);
      
      // Return formatted results
      return WeatherForecast({
        location: weatherData.location.name,
        days: weatherData.forecast.forecastday
      });
    } catch (error) {
      // Log and handle errors
      logger.error(LogCategory.NODE, '[Weather]', 'Weather tool error:', { error, location });
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      return createToolResult(
        'weather_error',
        formatErrorMessage('Error', `Unable to get weather for "${location}": ${errorMessage}`)
      );
    }
  }
};

// Export for auto-registration
export const tools = {
  weather: weatherTool
};
```

### 第三步：输出组件

```typescript
// components.tsx
import { formatBold, formatHeader, formatItalic, joinSections, createToolResult } from '@/lib/utils/markdown-utils';

// Types for weather data
export interface WeatherDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    daily_chance_of_rain: number;
  };
}

export interface WeatherForecastProps {
  location: string;
  days: WeatherDay[];
}

// 用于格式化天气预报输出的组件
export function WeatherForecast(props: WeatherForecastProps) {
  const { location, days } = props;
  
  // Format each day's forecast
  const forecastDays = days.map(day => {
    const date = new Date(day.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    
    return `${formatBold(date)}
Temperature: ${day.day.mintemp_c}°C to ${day.day.maxtemp_c}°C
Condition: ${day.day.condition.text}
Chance of rain: ${day.day.daily_chance_of_rain}%`;
  });
  
  // Combine into a single result
  return createToolResult(
    'weather_forecast',
    joinSections(
      formatHeader(`Weather forecast for ${location}`),
      forecastDays.join('\n\n')
    )
  );
}
```

### 第四步：API 工具函数

```typescript
// utils.ts
import { z } from 'zod';

// 使用 Zod 对接口响应做类型校验
const weatherResponseSchema = z.object({
  location: z.object({
    name: z.string(),
    region: z.string(),
    country: z.string(),
  }),
  forecast: z.object({
    forecastday: z.array(z.object({
      date: z.string(),
      day: z.object({
        maxtemp_c: z.number(),
        mintemp_c: z.number(),
        condition: z.object({
          text: z.string(),
          icon: z.string(),
        }),
        daily_chance_of_rain: z.number(),
      })
    }))
  })
});

// 调用天气 API 的工具函数
export async function fetchWeatherData(location: string, days: number) {
  // Get API key from environment variable
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('Weather API key not configured');
  }
  
  // Make API request
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=${days}&aqi=no&alerts=no`
  );
  
  // Handle API errors
  if (!response.ok) {
    let errorText = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error && errorData.error.message) {
        errorText = errorData.error.message;
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
    throw new Error(errorText);
  }
  
  // Parse and validate response
  const data = await response.json();
  return weatherResponseSchema.parse(data);
}
```

## 在工具中使用 LLM

自定义工具可以复用当前智能体的 LLM 实例，用于生成内容或分析数据：

```typescript
// 示例：在新闻摘要工具中使用 LLM
async execute({ query }, options) {
  try {
    // Fetch news articles
    const articles = await fetchNewsArticles(query);
    
    // Use LLM to generate a summary if available
    if (options.llmContext?.llm) {
      // Format articles for the LLM
      const articlesText = articles.map(a => 
        `TITLE: ${a.title}\nSUMMARY: ${a.description}`
      ).join('\n\n');
      
      // Create prompt for the LLM
      const messages = [
        {
          role: 'system',
          content: 'You are a news summarization assistant. Create a concise summary of these news articles about the given topic. Focus on the most important information and common themes.'
        },
        {
          role: 'user',
          content: `Topic: ${query}\n\nArticles:\n${articlesText}\n\nPlease create a concise summary of these news articles.`
        }
      ];
      
      // Generate summary with the LLM
      const result = await options.llmContext.llm.generateText({ 
        messages,
        temperature: 0.3,
        maxTokens: 500
      });
      
      // Return formatted result
      return NewsSummary({ 
        query, 
        articles,
        summary: result.text
      });
    }
    
    // Fallback if LLM is not available
    return NewsSummary({ 
      query, 
      articles,
      summary: "AI-generated summary not available. Please review the article excerpts below."
    });
  } catch (error) {
    // Error handling
    return createToolResult(
      'news_error',
      formatErrorMessage('Error', `Failed to fetch news: ${error.message}`)
    );
  }
}
```

## 工具注册流程

在参考实现中，`src/nodes/init.ts` 会集中导入并注册所有工具：

```typescript
// src/nodes/init.ts example
import { tools as searchTools } from './search';
import { tools as weatherTools } from './weather';
import { tools as stockPriceTools } from './stock-price';
// ... other tool imports

// 汇总所有工具
export const allTools = {
  ...searchTools,
  ...weatherTools,
  ...stockPriceTools,
  // ... other tools
};

// 注册到 ToolRegistry
export function registerTools() {
  const registry = getToolRegistry();
  Object.entries(allTools).forEach(([name, tool]) => {
    registry.registerTool(name, tool);
  });
}
```

## 进阶能力

### 1. 工具链（Tool Chaining）

一个工具可以消费前一个工具的结果，形成链式调用：

```typescript
// 研究工具：基于搜索结果继续分析
export const researchTool: Tool = {
  name: 'research',
  description: 'Research a topic in depth',
  parameters: researchSchema,
  async execute({ query, depth = 2 }, options) {
    // First, search for information
    const searchResults = await searchWeb(query);
    
    // Then, analyze the results with the LLM
    if (options.llmContext?.llm) {
      const analysis = await options.llmContext.llm.generateText({
        messages: [
          {
            role: 'system',
            content: 'Analyze these search results and identify key insights.'
          },
          {
            role: 'user',
            content: `Analyze these search results about "${query}": ${JSON.stringify(searchResults)}`
          }
        ]
      });
      
      return ResearchResults({ query, results: searchResults, analysis: analysis.text });
    }
    
    return ResearchResults({ query, results: searchResults });
  }
};
```

### 2. 多步骤工具（Multi-Step Tools）

工具内部也可以拆分为多个步骤：

```typescript
// 多步骤数据分析工具
export const dataAnalysisTool: Tool = {
  name: 'analyze_data',
  description: 'Analyze data in multiple steps',
  parameters: dataAnalysisSchema,
  async execute({ dataset, analysis_type }, options) {
    try {
      // Step 1: Load and validate data
      const data = await loadDataset(dataset);
      
      // Step 2: Perform statistical analysis
      const stats = performStatisticalAnalysis(data, analysis_type);
      
      // Step 3: Generate insights with LLM
      let insights = "Statistical analysis complete";
      if (options.llmContext?.llm) {
        const result = await options.llmContext.llm.generateText({
          messages: [
            {
              role: 'system',
              content: `You are a data analysis expert. Generate insights based on the statistical analysis of a dataset.`
            },
            {
              role: 'user',
              content: `Dataset: ${dataset}\nAnalysis Type: ${analysis_type}\nStatistics: ${JSON.stringify(stats)}\n\nWhat insights can we draw from this analysis?`
            }
          ]
        });
        insights = result.text;
      }
      
      // Return formatted results
      return DataAnalysisResults({
        dataset,
        analysis_type,
        statistics: stats,
        insights
      });
    } catch (error) {
      return createToolResult(
        'analysis_error',
        formatErrorMessage('Error', `Analysis failed: ${error.message}`)
      );
    }
  }
};
```

## 最佳实践

### 1. 输入校验

始终使用 Zod Schema 校验输入参数：

```typescript
const stockPriceSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol (e.g., AAPL, MSFT)'),
  period: z.enum(['1d', '1w', '1m', '3m', '6m', '1y', '5y'])
    .default('1m')
    .describe('Time period for historical data')
});
```

### 2. 错误处理

实现统一、友好的错误处理：

```typescript
try {
  // Tool logic
} catch (error) {
  logger.error(LogCategory.NODE, '[MyTool]', 'Execution error:', { error });
  
  // Provide user-friendly error messages
  let errorMessage = 'An unexpected error occurred';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  return createToolResult(
    'error',
    formatErrorMessage('Error', errorMessage)
  );
}
```

### 3. 输出格式化

使用统一的工具方法格式化输出：

```typescript
return createToolResult(
  'my_tool_result',
  joinSections(
    formatHeader(`Results for ${query}`),
    formatBold('Key Findings:'),
    results.join('\n\n')
  )
);
```

### 4. API 安全

安全地访问外部 API：

```typescript
// 不要把 API Key 写死在代码里
const apiKey = process.env.MY_API_KEY;
if (!apiKey) {
  throw new Error('API key not configured');
}

// 始终使用 HTTPS
const response = await fetch(`https://api.example.com/data?key=${apiKey}&q=${encodeURIComponent(query)}`);

// 校验 API 返回结果
if (!response.ok) {
  throw new Error(`API error: ${response.status}`);
}
```

### 5. 性能优化

在工具中注意性能和资源使用：

```typescript
// 缓存高成本操作
const cachedResults = await redis.get(`cache:${cacheKey}`);
if (cachedResults) {
  return JSON.parse(cachedResults);
}

// 设置合理的超时时间
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
try {
  const response = await fetch(url, { signal: controller.signal });
  // Process response
} finally {
  clearTimeout(timeoutId);
}
```

## 常见问题排查

下面是一些常见问题及解决思路。

### 1. 工具没有出现在智能体中

```typescript
// 确认导出了 tools 对象
export const tools = {
  my_tool: myTool
};

// 并确保在 src/nodes/init.ts 中被正确引入
```

### 2. 参数错误

参数不生效或结构异常时，可以：

```typescript
// 使用有语义的参数名，便于 LLM 理解
const searchSchema = z.object({
  query: z.string().describe('Search query to look up'),
  // NOT: q: z.string().describe('Search query')
});

// 为可选参数设置合理默认值
const limit = z.number().optional().default(10).describe('Maximum results');
```

### 3. 输出未正确渲染

```typescript
// 必须返回 createToolResult 包裹后的结果
return createToolResult('my_tool_result', formattedOutput);

// NOT: return formattedOutput;
```

## 更多示例

### 股票价格工具（Stock Price Tool）

```typescript
// stock-price/index.ts
import { z } from 'zod';
import { Tool } from '../types';
import { StockPriceResults } from './components';
import { fetchStockData } from './utils';

const stockPriceSchema = z.object({
  symbol: z.string().describe('Stock ticker symbol (e.g., AAPL, MSFT)'),
  period: z.enum(['1d', '1w', '1m', '3m', '6m', '1y', '5y'])
    .default('1m')
    .describe('Time period for historical data')
});

export const stockPriceTool: Tool = {
  name: 'stock_price',
  description: 'Get stock price information and historical data',
  parameters: stockPriceSchema,
  async execute({ symbol, period = '1m' }) {
    try {
      const stockData = await fetchStockData(symbol, period);
      return StockPriceResults({ symbol, period, data: stockData });
    } catch (error) {
      return createToolResult(
        'stock_price_error',
        formatErrorMessage('Error', `Unable to get stock data for ${symbol}: ${error.message}`)
      );
    }
  }
};

export const tools = {
  stock_price: stockPriceTool
};
```

### 图像分析工具（Image Analysis Tool）

```typescript
// image-analysis/index.ts
import { z } from 'zod';
import { Tool } from '../types';
import { analyzeImage } from './utils';
import { ImageAnalysisResults } from './components';

const imageAnalysisSchema = z.object({
  url: z.string().url().describe('URL of the image to analyze'),
  analysis_type: z.enum(['objects', 'faces', 'text', 'colors'])
    .default('objects')
    .describe('Type of analysis to perform on the image')
});

export const imageAnalysisTool: Tool = {
  name: 'analyze_image',
  description: 'Analyze an image to detect objects, faces, text, or colors',
  parameters: imageAnalysisSchema,
  async execute({ url, analysis_type = 'objects' }) {
    try {
      const results = await analyzeImage(url, analysis_type);
      return ImageAnalysisResults({ url, analysis_type, results });
    } catch (error) {
      return createToolResult(
        'image_analysis_error',
        formatErrorMessage('Error', `Image analysis failed: ${error.message}`)
      );
    }
  }
};

export const tools = {
  analyze_image: imageAnalysisTool
};
```

## 总结

自定义工具是扩展 AgentDock 能力最直接、最常用的方式。  
按照本指南中的结构与最佳实践，你可以为智能体增加各类专业功能——从简单查询、数据分析，到复杂的多步骤自动化流程。  
如需了解底层节点体系，可结合「节点系统总览」文档与 AgentDock Core 的 API 参考一起阅读。 
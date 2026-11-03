import { Request, Response } from 'express';
import AnalysisLog from '../models/AnalysisLog';

export const getMetrics = async (_req: Request, res: Response) => {
  try {
    const totalAnalyses = await AnalysisLog.countDocuments();

    const latencyResult = await AnalysisLog.aggregate([
      { $group: { _id: null, avgLatency: { $avg: '$processingTimeMs' } } },
    ]);

    const averageLatencyMs = Math.round((latencyResult[0]?.avgLatency ?? 0) * 100) / 100;

    const recentAnalyses = await AnalysisLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('imageUrl processingTimeMs createdAt')
      .lean();

    res.status(200).json({
      totalAnalyses,
      averageLatencyMs,
      recentAnalyses,
    });
  } catch (err) {
    res.status(500).json({
      message: err instanceof Error ? err.message : 'Internal server error',
    });
  }
};

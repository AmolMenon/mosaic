import { PipelineArtifact } from "@mosaic/contracts";
import { ScoredICReview } from "./ICReviewScorer";
import * as crypto from "crypto";

export interface ReviewTrace {
  promptVersion: string;
  modelProvider: string;
  modelVersion: string;
  temperature: number;
  inputHypothesisIds: string[];
  inputEvidenceIds: string[];
  generatedCounterArguments: number;
  validationResults: any;
  tokenUsage: number;
  runtime: number;
}

export interface ICArtifactContext {
  pipelineId: string;
  executionId: string;
  provider: string;
  providerVersion: string;
  documentId: string;
  timestamp: string;
}

export class ICArtifactFactory {
  
  static createArtifacts(
    review: ScoredICReview,
    trace: ReviewTrace,
    context: ICArtifactContext
  ): Partial<PipelineArtifact>[] {
    
    const artifacts: Partial<PipelineArtifact>[] = [];

    const hash = crypto.createHash('sha256').update(review.hypothesisId).update(context.timestamp).digest('hex');
    const reviewId = `icrev_${hash.substring(0, 16)}`;

    // Main Review Proposal Artifact
    artifacts.push(this.buildArtifact('ICReviewProposal', {
      id: reviewId,
      ...review
    }, context));

    // Discrete CounterArgument Artifacts
    for (const ca of review.counterarguments) {
      const caHash = crypto.createHash('sha256').update(ca.claim).update(reviewId).digest('hex');
      artifacts.push(this.buildArtifact('CounterArgument', {
        id: `ca_${caHash.substring(0, 16)}`,
        reviewId,
        hypothesisId: review.hypothesisId,
        ...ca
      }, context));
    }

    // Discrete DiligenceGap Artifacts
    for (const gap of review.missingEvidence) {
      const gapHash = crypto.createHash('sha256').update(gap.missingInformation).update(reviewId).digest('hex');
      artifacts.push(this.buildArtifact('DiligenceGap', {
        id: `gap_${gapHash.substring(0, 16)}`,
        reviewId,
        hypothesisId: review.hypothesisId,
        ...gap
      }, context));
    }

    // Trace Artifact
    artifacts.push(this.buildArtifact('ReviewTrace', trace, context));

    return artifacts;
  }

  private static buildArtifact(type: string, payload: any, context: ICArtifactContext): Partial<PipelineArtifact> {
    return {
      type,
      payload,
      provenance: {
        producerStage: context.executionId,
        provider: context.provider,
        pipelineId: context.pipelineId,
        version: 1,
        timestamp: context.timestamp
      }
    };
  }
}

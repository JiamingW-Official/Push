/**
 * Stage primitives — shared component layer for the 7-stage creator
 * funnel. Single import surface; never deep-import.
 *
 *   import {
 *     StageShell, StageBanner, StageHeader, StageChip,
 *     StageTwoCol, StageMain, StageRail,
 *     StageCard, StageRailCard,
 *     StageButton, StageButtonStack,
 *     StageStep, StageEligRow, StagePayRow, StageRiskFlag,
 *     StageMerchAvatar, StageThreadMsg,
 *     StageProgressStrip, StageStat,
 *   } from "@/components/shared/stage";
 */

export {
  StageShell,
  StageJourney,
  StageBanner,
  StageHeader,
  StageChip,
  StageTwoCol,
  StageMain,
  StageRail,
  StageCard,
  StageRailCard,
  StageButton,
  StageButtonStack,
  StageStep,
  StageEligRow,
  StagePayRow,
  StageRiskFlag,
  StageMerchAvatar,
  StageThreadMsg,
  StageProgressStrip,
  StageStat,
} from "./Stage";

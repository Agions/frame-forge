use crate::HardwareEncoderCaps;
use std::fmt;

pub enum VideoCodec {
    H264,
    H265,
    VP9,
    AV1,
}

impl fmt::Display for VideoCodec {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            VideoCodec::H264 => write!(f, "libx264"),
            VideoCodec::H265 => write!(f, "libx265"),
            VideoCodec::VP9 => write!(f, "libvpx-vp9"),
            VideoCodec::AV1 => write!(f, "libaom-av1"),
        }
    }
}

pub enum EncoderPreset {
    Ultrafast,
    Fast,
    Medium,
    Slow,
    Veryslow,
}

pub struct EncoderConfig {
    pub codec: VideoCodec,
    pub bitrate: String,
    pub preset: EncoderPreset,
}

pub fn select_optimal_encoder(caps: &HardwareEncoderCaps) -> EncoderConfig {
    if caps.nvenc {
        // Here we'd ideally return a hardware codec string like "h264_nvenc" but for this interface we map to standard enums
        EncoderConfig {
            codec: VideoCodec::H264,
            bitrate: "5000k".to_string(),
            preset: EncoderPreset::Fast,
        }
    } else if caps.videotoolbox {
        EncoderConfig {
            codec: VideoCodec::H265, // HEVC is commonly used on Apple
            bitrate: "5000k".to_string(),
            preset: EncoderPreset::Fast,
        }
    } else if caps.qsv {
        EncoderConfig {
            codec: VideoCodec::H264,
            bitrate: "5000k".to_string(),
            preset: EncoderPreset::Medium,
        }
    } else {
        EncoderConfig {
            codec: VideoCodec::H264,
            bitrate: "3000k".to_string(),
            preset: EncoderPreset::Medium,
        }
    }
}

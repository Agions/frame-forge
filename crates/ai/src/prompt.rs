use crate::ArtStylePreset;
use serde::{Deserialize, Serialize};

pub const DEFAULT_NEGATIVE_PROMPT: &str = "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, \
                                            fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, \
                                            signature, watermark, username, blurry, artist name, bad feet, distorted face";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PromptOutput {
    pub positive: String,
    pub negative: String,
}

pub struct PromptBuilder {
    positive_parts: Vec<String>,
    negative_prompt: String,
}

impl PromptBuilder {
    pub fn new(style: &ArtStylePreset) -> Self {
        Self {
            positive_parts: vec![style.prompt_prefix().to_string()],
            negative_prompt: DEFAULT_NEGATIVE_PROMPT.to_string(),
        }
    }

    pub fn with_camera(mut self, shot_type: &str) -> Self {
        if !shot_type.is_empty() {
            self.positive_parts.push(shot_type.to_string());
        }
        self
    }

    pub fn with_character(mut self, char_tags: &str) -> Self {
        if !char_tags.is_empty() {
            self.positive_parts.push(char_tags.to_string());
        }
        self
    }

    pub fn with_scene(mut self, description: &str) -> Self {
        if !description.is_empty() {
            self.positive_parts.push(description.to_string());
        }
        self
    }

    pub fn build(self) -> PromptOutput {
        PromptOutput {
            positive: self.positive_parts.join(", "),
            negative: self.negative_prompt,
        }
    }
}

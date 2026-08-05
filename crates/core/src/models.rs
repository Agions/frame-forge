use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum WorkflowStage {
    Draft,                 // 1. 草稿阶段 (小说导入)
    ScriptParsed,          // 2. 剧本分集拆解完成
    StoryboardGenerated,   // 3. 分镜与 Prompt 画面构建完成
    AudioSynthesized,      // 4. TTS 配音与音轨对齐完成
    Rendering,             // 5. 视频渲染导出中
    Completed,             // 6. 漫剧最终导出完成
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectMetadata {
    pub id: String,
    pub name: String,
    pub author: String,
    pub version: String,
    pub created_at: u64,
    pub updated_at: u64,
    pub stage: WorkflowStage,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum CharacterGender {
    Male,
    Female,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CharacterAsset {
    pub id: String,
    pub name: String,
    pub avatar_url: Option<String>,
    pub prompt_tags: String,
    pub lora_model: Option<String>,
    pub description: Option<String>,
    pub gender: Option<CharacterGender>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShotModel {
    pub id: String,
    pub scene_id: String,
    pub order: u32,
    pub dialogue: Option<String>,
    pub character_name: Option<String>,
    pub prompt: String,
    pub negative_prompt: String,
    pub image_url: Option<String>,
    pub audio_url: Option<String>,
    pub duration_seconds: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SceneModel {
    pub id: String,
    pub episode_id: String,
    pub order: u32,
    pub title: String,
    pub description: String,
    pub shots: Vec<ShotModel>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EpisodeModel {
    pub id: String,
    pub order: u32,
    pub title: String,
    pub scenes: Vec<SceneModel>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectConfig {
    pub default_art_style: String,
    pub default_resolution: String,
    pub default_fps: u32,
    pub auto_save_interval_secs: u32,
}

impl Default for ProjectConfig {
    fn default() -> Self {
        Self {
            default_art_style: "Anime".to_string(),
            default_resolution: "1920x1080".to_string(),
            default_fps: 24,
            auto_save_interval_secs: 300,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MangaProject {
    pub metadata: ProjectMetadata,
    pub config: ProjectConfig,
    pub characters: Vec<CharacterAsset>,
    pub episodes: Vec<EpisodeModel>,
}

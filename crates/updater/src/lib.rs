use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateInfo {
    pub current_version: String,
    pub latest_version: String,
    pub update_available: bool,
    pub release_notes: Option<String>,
    pub download_url: Option<String>,
}

pub fn check_for_updates(current_version: &str) -> UpdateInfo {
    UpdateInfo {
        current_version: current_version.to_string(),
        latest_version: current_version.to_string(),
        update_available: false,
        release_notes: None,
        download_url: None,
    }
}

pub fn get_current_version() -> String {
    "3.0.0".to_string()
}
